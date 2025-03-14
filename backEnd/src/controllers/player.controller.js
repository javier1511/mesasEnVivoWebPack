import Players from "../models/Players";



export const createPlayer = async (req, res) => {
    try {
        const {name, mobile, email, curp, address, date, time, gender, areamobile} = req.body;
        const newPlayer = new Players({name, mobile, email, curp, address, time, gender, date, areamobile});
        
        // Intentamos guardar el nuevo jugador
        const playerSave = await newPlayer.save();
        
        // Si se guarda correctamente, enviamos la respuesta con el jugador guardado
        res.status(201).json(playerSave);
    } catch (error) {
        // Si ocurre un error, enviamos una respuesta de error con un estado adecuado y el mensaje del error
        res.status(400).json({ message: error.message });
    }
};




export const getPlayer = async (req, res) => {
    try {
        const players = await Players.find()
        res.json(players)
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}






export const getPlayersById = async(req, res) => {

    try {

        const players = await Players.findById(req.params.playerId)
        res.status(200).json(players)
        
    } catch (error) {
        res.status(404).json({message: error.message})
    }
   
}




export const updatePlayersById = async(req, res) => {

    const players = await Players.findByIdAndUpdate(req.params.playerId, req.body, {
        new:true
    })
    res.status(200).json(players)

    try {
        
    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
 
}


export const deletePlayerById = async (req, res) => {
    try {
        const player = await Players.findByIdAndDelete(req.params.playerId);

        // Si no se encuentra el jugador
        if (!player) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        // Devolver el jugador eliminado con un código de estado 200
        res.status(200).json(player);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
