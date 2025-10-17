import Sales from "../models/Sales";

export const getUniquePlayersByDate = async (req, res) => {
    try {

        const {fechaInicio, fechaFin} = req.query;
        if(!fechaInicio || !fechaFin) {
            return res.status(400).json({error :"Debes seleccionar fecha de inicio y fecha fin"});
        }

        const startDate = new Date(fechaInicio); startDate.setHours(0,0,0,0);
        const endDate = new Date(fechaFin); endDate.setHours(23,59,59,999);

        const conteo = await Sales.aggregate([
            { $match: { date: {$gte: startDate, $lte: endDate}}},
            {
                $group:{
                    _id:{$dateToString:{format : "%Y-%m-%d", date: "$date"}},
                    aforoClientes:{ $addToSet: "$player"}
                }
            },  

            {$project: {_id: 1, aforoClientes: {$size: "$aforoClientes"}}},
            {$sort: {_id: 1}},
            {
                $group:{
                    _id:null,
                    totalAforo: {$sum: "$aforoClientes"},
                    porFecha:{$push: { fecha: "$_id", aforoClientes:"$aforoClientes"}}
                }
            },
            {$project: {_id:0, totalAforo: 1, porFecha:1}}



        ]);

        const {totalAforo = 0, porFecha = []} = conteo[0] || {};
        res.json({fechaInicio, fechaFin, totalAforo, porFecha})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error interno del servidor"})
        
    }
}