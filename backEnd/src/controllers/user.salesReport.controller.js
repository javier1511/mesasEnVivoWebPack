import Sales from "../models/Sales.js";

export const getUserReport = async (req, res) => {
  try {
    const { fechaInicioUser, fechaFinUser } = req.query;
    if (!fechaInicioUser || !fechaFinUser) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar fecha de inicio y fecha fin" });
    }

    const startDate = new Date(fechaInicioUser);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(fechaFinUser);
    endDate.setHours(23, 59, 59, 999);

    const resultUsers = await Sales.aggregate([
      { 
        $match: { date: { $gte: startDate, $lte: endDate } }
      },
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
      {
        $project: {
          _id:       0,
          userId:    "$_id",
          totalCash:    1,
          totalCredit:  1,
          totalDollars: 1,
          totalCashIn:  1,
          totalPayment: 1,
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
      { $sort: { userId: 1 } }  // o elimina esta etapa si no la necesitas
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

export default getUserReport;
