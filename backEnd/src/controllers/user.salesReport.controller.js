import Sales from "../models/Sales.js";

export const getUserReport = async (req, res) => {
  try {
    const { fechaInicioUser, fechaFinUser } = req.query;
    if (!fechaInicioUser || !fechaFinUser) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar fecha de inicio y fecha fin" });
    }

    // Construcción de rangos de fecha
    const startDate = new Date(fechaInicioUser);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(fechaFinUser);
    endDate.setHours(23, 59, 59, 999);

    const resultUsers = await Sales.aggregate([
      // 1) Filtrar por rango de fechas
      { $match: { date: { $gte: startDate, $lte: endDate } } },

      // 2) Agrupar por user ObjectId
      {
        $group: {
          _id: "$user",
          totalCash:    { $sum: "$cash" },
          totalCredit:  { $sum: "$credit" },
          totalDollars: { $sum: "$dollars" },
          totalCashIn:  { $sum: "$cashIn" },
          totalPayment: { $sum: "$payment" }
        }
      },

      // 3) “Populate” manual con $lookup
      {
        $lookup: {
          from: "users",           // nombre de la colección en MongoDB
          localField: "_id",       // el _id del grupo (que es el user ObjectId)
          foreignField: "_id",     // el campo _id en la colección users
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },   // desanidar el arreglo userInfo

      // 4) Calcular caja y netwin, y proyectar lo que queremos devolver
      {
        $addFields: {
          caja: {
            $subtract: [
              { $add: ["$totalCashIn", "$totalCash", "$totalDollars"] },
              "$totalPayment"
            ]
          },
          netwin: {
            $subtract: [
              { $add: ["$totalCash", "$totalDollars", "$totalCredit"] },
              "$totalPayment"
            ]
          }
        }
      },
      {
        $project: {
          _id:        0,
          userId:     "$_id",
          username:   "$userInfo.username",
          totalCash:    1,
          totalCredit:  1,
          totalDollars: 1,
          totalCashIn:  1,
          totalPayment: 1,
          caja:       1,
          netwin:     1
        }
      },

      // 5) (Opcional) ordenar por userId o username
      { $sort: { username: 1 } }
    ]);

    if (resultUsers.length === 0) {
      return res.json({ message: "No hay ventas en este rango de fechas" });
    }
    res.json(resultUsers);
  } catch (error) {
    console.error("Error en el servidor", error);
    res.status(500).json({ error: "Error al obtener el resumen" });
  }
};
