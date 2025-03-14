import Player from "../models/Players.js";

export const getPlayersByDate = async(req, res) => {
    try{
        const results = await Player.aggregate([
            {
                $group:{
                    _id:{
                        $dateToString :{format: "%d/%m/%Y", date:"$date"}
                    },
                    totalClientes:{ $sum:1}
                }
            },
            {$sort : {_id: 1}}

        ]);
        res.json(results);
    }catch(error){
        console.error("Error al obtener clientes por fecha", error);
        res.status(500).json({error:"Error interno del servidor"})
    }
};

export default getPlayersByDate