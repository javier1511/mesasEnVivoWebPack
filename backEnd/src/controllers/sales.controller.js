import Players from "../models/Players";
import Sales from "../models/Sales";
import Summary from "../models/Summary.js";
import BusinessDay from "../models/BusinessDay.js";


const normalizeYMD = (val) => {
  if (typeof val !== "string") return null;
  const s = val.trim();
  const ymd = s.includes("T") ? s.split("T")[0] : s; // corta ISO
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd) ? ymd : null;
};


export const createSales = async (req, res) => {
    try {

      const {
        player,
        user,
        cashIn,
        cash,
        name,
        credit,
        dollars,
        payment,
        date,
        time,
      } = req.body;

       const ymd = normalizeYMD(date);
    if (!ymd) return res.status(400).json({ message: "Fecha de venta inválida" });

    const day = await BusinessDay.findOne({ date: ymd }).lean();
    if (!day || day.status !== "open") {
      return res.status(409).json({ error: "Revisa el estatus del dia" });
    }
  
      // 1) Validaciones mínimas
      if (!player || !name || !user || date == null || time == null) {
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
        user,
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

// Helper para evitar inyección/regex inválidos
const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSales = async (req, res) => {
  try {
    const { date, name } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Debes proporcionar fecha (YYYY-MM-DD)" });
    }

    // Rango del día local
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Filtro base por fecha
    const match = { date: { $gte: startDate, $lt: endDate } };

    // Si viene name, filtra por coincidencia parcial (contiene)
    if (name && name.trim()) {
      match.name = { $regex: escapeRegex(name.trim()), $options: "i" };
      // Si prefieres "empieza con", usa: new RegExp(`^${escapeRegex(name.trim())}`, "i")
    }

    const [result] = await Sales.aggregate([
      { $match: match },
      {
        $facet: {
          sales: [
            { $sort: { date: -1, time: -1 } },
            // { $project: { player:1, user:1, cashIn:1, cash:1, credit:1, dollars:1, payment:1, name:1, date:1, time:1 } }
          ],
          totals: [
            {
              $group: {
                _id: null,
                cash:    { $sum: { $toDouble: { $ifNull: ["$cash", 0] } } },
                credit:  { $sum: { $toDouble: { $ifNull: ["$credit", 0] } } },
                dollars: { $sum: { $toDouble: { $ifNull: ["$dollars", 0] } } },
                payment: { $sum: { $toDouble: { $ifNull: ["$payment", 0] } } },
                cashIn:  { $sum: { $toDouble: { $ifNull: ["$cashIn", 0] } } }
              }
            },
            {
              $project: {
                _id: 0,
                cash: 1, credit: 1, dollars: 1, payment: 1, cashIn: 1,
                user:   { $literal: "NA" },
                name:   { $literal: "NA" },
                player: { $literal: "NA" },
                time:   { $literal: "NA" }
              }
            }
          ]
        }
      }
    ]);

    const defaults = { cash: 0, credit: 0, dollars: 0, payment: 0, cashIn: 0, user: "NA", name: "NA", player: "NA", time: "NA" };
    const totalsDoc = result?.totals?.[0] ?? defaults;

    res.status(200).json({
      date,
      name: name ?? null, // eco del filtro usado
      totals: {
        cash: totalsDoc.cash,
        credit: totalsDoc.credit,
        dollars: totalsDoc.dollars,
        payment: totalsDoc.payment,
        cashIn: totalsDoc.cashIn,
        user: totalsDoc.user,
        name: totalsDoc.name,
        player: totalsDoc.player,
        time: totalsDoc.time
      },
      sales: result?.sales || []
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las ventas" });
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