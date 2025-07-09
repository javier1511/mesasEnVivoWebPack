import SalesPoker from "../models/SalesPoker";


export const createPokerSale = async (req, res) => {
    try {

        const {player, cash, name, credit, dollars, rake, payment, date, time} = req.body
        const newPokerSale = new SalesPoker({player, cash, name, credit, dollars, rake, payment, date, time});

        const newPokerSaleSave = await newPokerSale.save();

        res.status(201).json(newPokerSaleSave);
        
    } catch (error) {

        return res.status(400).json({message:error.message})
        
    }   


}


export const getPokerSale = async(req, res) => {
    try {

        const PokerSales = await SalesPoker.find().sort({date:-1, time: -1})
        res.json(PokerSales)

        
    } catch (error) {

        return res.status(500).json({message:error.message})
        
    }
}


export const getPokerSaleById = async(req, res) => {
    try {


        const pokerSales = await SalesPoker.findById(req.params.pokerId)
        if(!pokerSales){
            return res.status(404).json({message: "Busqueda de venta por id no encontrada"})
        }
        res.status(200).json(pokerSales)
        
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}


export const updatePokerSaleById = async (req, res) => {
    try {

        const updatePokerSale = await SalesPoker.findByIdAndUpdate(req.params.pokerId, req.body,{
            new:true
        })

        if(!updatePokerSale){
            return res.status(404).json({message: "Busqueda de venta para su actualizacion por id no encontrada"})
        }
        res.status(200).json(updatePokerSale)
        
    } catch (error) {

        res.status(404).json({message:error.message})
        
    }
}


export const deletePokerSaleById = async(req, res) => {
    try {

        const deletePokerSale = await SalesPoker.findByIdAndDelete(req.params.pokerId)

        if(!deletePokerSale){
            return res.status(404).json({message:"Venta para eliminar no encontrada"})
        }

        res.status(200).json(deletePokerSale)
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}