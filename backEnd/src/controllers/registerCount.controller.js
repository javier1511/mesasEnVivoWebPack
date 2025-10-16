import Player from "../models/Players.js";

export const getPlayersByDate = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debes seleccionar fecha de inicio y fecha fin" });
    }

    const startDate = new Date(fechaInicio); startDate.setHours(0,0,0,0);
    const endDate   = new Date(fechaFin);    endDate.setHours(23,59,59,999);

    const agg = await Player.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalClientes: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: null,
          totalGeneral: { $sum: "$totalClientes" },
          porFecha: { $push: { fecha: "$_id", totalClientes: "$totalClientes" } }
        }
      },
      { $project: { _id: 0, totalGeneral: 1, porFecha: 1 } }
    ]);

    const { totalGeneral = 0, porFecha = [] } = agg[0] || {};
    res.json({ fechaInicio, fechaFin, totalGeneral, porFecha });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
