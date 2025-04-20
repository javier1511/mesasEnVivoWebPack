import Players from "../models/Players";
import Sales from "../models/Sales";
import Summary from "../models/Summary.js";



export const createSales = async (req, res) => {
    try {
      const {
        player,
        cashIn,
        cash,
        name,
        credit,
        dollars,
        payment,
        date,
        time,
      } = req.body;
  
      // 1) Validaciones mínimas
      if (!player || !name || date == null || time == null) {
        return res
          .status(400)
          .json({ message: "Faltan campos requeridos en el body." });
      }
  
      // 2) Parseo a Number
      const cashValue    = Number(cash);
      const creditValue  = Number(credit);
      const dollarsValue = Number(dollars);
      const paymentValue = Number(payment);
      if (
        [cashValue, creditValue, dollarsValue, paymentValue].some(isNaN)
      ) {
        return res
          .status(400)
          .json({ message: "Los montos deben ser numéricos." });
      }
  
      // 3) Guardar la venta
      const newSale = new Sales({
        player,
        cashIn,
        cash: cashValue,
        name,
        credit: creditValue,
        dollars: dollarsValue,
        payment: paymentValue,
        date,
        time,
      });
      const saleSaved = await newSale.save();
  
      // 4) Calcular netwin = cash + credit + dollars - payment
      const netwinInc = cashValue + creditValue + dollarsValue - paymentValue;
  
      // 5) Actualizar o crear el summary
      const summaryUpdated = await Summary.findOneAndUpdate(
        { player },
        {
          $inc: {
            totalCash:    cashValue,
            totalCredit:  creditValue,
            totalDollars: dollarsValue,
            totalPayment: paymentValue,
            netwin:       netwinInc,
          },
        },
        { new: true, upsert: true }
      );
  
      return res.status(201).json({
        sale:    saleSaved,
        summary: summaryUpdated,
      });
  
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
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
        const sales = await Sales.find().sort({date: -1});
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
      // 1) Eliminar la venta y obtener sus datos
      const sale = await Sales.findByIdAndDelete(req.params.saleId);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
  
      // 2) Extraer valores para descontar
      const {
        player,
        cash,
        credit,
        dollars,
        payment,
      } = sale;
      const cashValue    = Number(cash);
      const creditValue  = Number(credit);
      const dollarsValue = Number(dollars);
      const paymentValue = Number(payment);
  
      // 3) Calcular netwin decrement = cash + credit + dollars - payment
      const netwinDec = cashValue + creditValue + dollarsValue - paymentValue;
  
      // 4) Actualizar el summary restando esos valores
      const summaryUpdated = await Summary.findOneAndUpdate(
        { player },
        {
          $inc: {
            totalCash:    -cashValue,
            totalCredit:  -creditValue,
            totalDollars: -dollarsValue,
            totalPayment: -paymentValue,
            netwin:       -netwinDec,
          },
        },
        { new: true }
      );
  
      // 5) Si el summary quedó en cero (o no existe), podrías borrarlo:
      // const shouldDelete = summaryUpdated &&
      //   summaryUpdated.totalCash === 0 &&
      //   summaryUpdated.totalCredit === 0 &&
      //   summaryUpdated.totalDollars === 0 &&
      //   summaryUpdated.totalPayment === 0;
      // if (shouldDelete) {
      //   await Summary.deleteOne({ player });
      // }
  
      return res.status(200).json({
        message: "Sale deleted",
        summary: summaryUpdated,
      });
  
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error al eliminar la venta", details: error.message });
    }
  };