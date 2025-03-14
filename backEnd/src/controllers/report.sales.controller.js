import Sales from "../models/Sales.js";

export const getSalesReport = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: "Debes proporcionar fechaInicio y fechaFin en formato YYYY-MM-DD" });
        }

        // Convertir fechas en objetos Date
        const startDate = new Date(fechaInicio);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(fechaFin);
        endDate.setHours(23, 59, 59, 999);

        // Usar aggregate para agrupar por fecha
        const result = await Sales.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalCash: { $sum: "$cash" },
                    totalCredit: { $sum: "$credit" },
                    totalDollar: { $sum: "$dollars" },
                    totalCashIn: { $sum: "$cashIn" },
                    totalPayment: { $sum: "$payment" }
                }
            },
            {
                $project: {
                    _id: 0,
                    fecha: "$_id",
                    totalCash: 1,
                    totalCredit: 1,
                    totalDollar: 1,
                    totalCashIn:1,
                    totalPayment:1,
                    caja: { 
                        $subtract: [
                            { $add: ["$totalCashIn", "$totalCash", "$totalDollar"] }, 
                            "$totalPayment"
                        ]
                    },
                    netwin: { 
                        $subtract: [
                            { $add: ["$totalCash", "$totalDollar", "$totalCredit"] }, 
                            "$totalPayment"
                        ]
                    }
                }
            },
            { $sort: { fecha: 1 } } // Ordenar por fecha ascendente
        ]);

        res.json(result.length > 0 ? result : { message: "No hay ventas en este rango de fechas" });

    } catch (error) {
        console.error("Error en getSalesReport:", error);
        res.status(500).json({ error: "Error al obtener el resumen" });
    }
};

export default getSalesReport;
