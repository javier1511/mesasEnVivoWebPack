import Players from "../models/Players";
import Sales from "../models/Sales";
import Summary from "../models/Summary.js";

export const createSales = async (req, res) => {
    try {
        const { player, cash, cashIn, name, credit, dollars, date, time, payment } = req.body;

        // Convertir a números para evitar errores en los cálculos
        const cashValue = Number(cash);
        const creditValue = Number(credit);
        const dollarsValue = Number(dollars);
        const paymentValue = Number(payment);

        // Validar que los campos necesarios estén presentes
        if (!player || !cash || !name || !credit || !dollars || !date || !time || !cashIn || !payment) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Buscar el jugador por ID
        const playerId = await Players.findById(player);
        if (!playerId) {
            return res.status(404).send({ error: 'Player not found' });
        }

        // Crear una nueva venta con el ID del jugador
        const newSale = new Sales({
            name,
            player: playerId._id,
            cash: cashValue,
            cashIn,
            credit: creditValue,
            dollars: dollarsValue,
            payment: paymentValue,
            date,
            time
        });

        // Guardar la nueva venta en la base de datos
        const saleSave = await newSale.save();

        const existingSummary = await Summary.findOne({ player: playerId._id });

        if (existingSummary) {
            const updatedNetwin = Number(existingSummary.netwin) +
                (cashValue + creditValue + dollarsValue - paymentValue);

            await Summary.findOneAndUpdate(
                { player: playerId._id },
                {
                    $inc: {
                        totalCash: cashValue,
                        totalCredit: creditValue,
                        totalDollars: dollarsValue,
                        totalPayment: paymentValue,
                    },
                    $set: { netwin: updatedNetwin }
                }
            );
        } else {
            const newSummary = new Summary({
                player: playerId._id,
                totalCash: cashValue,
                totalCredit: creditValue,
                totalDollars: dollarsValue,
                totalPayment: paymentValue,
                netwin: (cashValue + creditValue + dollarsValue - paymentValue)
            });
            await newSummary.save();
        }

        return res.status(201).json(saleSave);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear la venta' });
    }
};



export const getSummaryByClient = async (req, res) => {
    try {
        const summaries = await Summary.find()
            .populate('player', 'name mobile');

        const enrichedSummaries = await Promise.all(summaries.map(async (summary) => {
            const lastSale = await Sales.findOne({ player: summary.player._id })
                .sort({ date: -1 }) // Orden descendente por fecha
                .select('date');    // Solo obtenemos la fecha

            const result = {
                ...summary.toObject(),
                lastPurchaseDate: lastSale ? lastSale.date : null
            };

            // Mostrar en consola cada resumen enriquecido
            console.log(result);

            return result;
        }));

        res.status(200).json(enrichedSummaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el resumen de ventas" });
    }
};

// Obtener todas las ventas
export const getSales = async (req, res) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

// Obtener una venta por ID
export const getSalesById = async (req, res) => {
    try {
        const sales = await Sales.findById(req.params.saleId);
        if (!sales) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la venta' });
    }
};

// Actualizar una venta por ID
export const updateSaleById = async (req, res) => {
    try {
        const sales = await Sales.findByIdAndUpdate(req.params.saleId, req.body, {
            new: true
        });
        if (!sales) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la venta' });
    }
};

// Eliminar una venta por ID
export const deleteSaleById = async (req, res) => {
    try {
        const sales = await Sales.findByIdAndDelete(req.params.saleId);
        if (!sales) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(204).json(); // No content, venta eliminada
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
};
