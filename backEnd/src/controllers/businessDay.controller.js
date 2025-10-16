import BusinessDay from "../models/BusinessDay";
const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);


// asumiendo que tienes isYMD fuera:
// const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

export const getBusinessDay = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debes seleccionar fecha de inicio y fecha fin" });
    }
    if (!isYMD(fechaInicio) || !isYMD(fechaFin)) {
      return res.status(400).json({ error: "Formato inválido. Usa YYYY-MM-DD" });
    }

    // Asegurar orden (por si vienen invertidas)
    const fi = fechaInicio <= fechaFin ? fechaInicio : fechaFin;
    const ff = fechaInicio <= fechaFin ? fechaFin : fechaInicio;

    // Filtrar por rango usando strings YYYY-MM-DD
    const businessDay = await BusinessDay
      .find({ date: { $gte: fi, $lte: ff } })
      .sort({ date: 1 })
      .lean();

    return res.json(businessDay);
  } catch (error) {
    console.error("GET /business-day error:", error);
    return res.status(500).json({ message: error.message });
  }
};



export const openBusinessDay = async (req, res) => {

    try {
        const {date} = req.body;
        if(!isYMD(date)) {
            return res.status(400).json({error: "La fecha es requerida"})
        }

        const alreadyOpen = await BusinessDay.findOne({status: "open"});
        if(alreadyOpen){
            return res.status(409).json({error:` Ya hay un dia abierto (${alreadyOpen.date}).`})
        }

        const existing = await BusinessDay.findOne({date});
        if(existing){
            if(existing.status === "closed"){
                return res.status(409).json({
                    error: `El dia ${date} existe pero esta cerrado. pide a un ADMIN que lo reabra`
                })
            }
            return res.status(409).json({error:`El dia ${date} ya existe y esta ${existing.status}.`})
        }

        const created = await BusinessDay.create({ date, status: "open"});
        return res.status(200).json({ok:true, date:created.date, status:created.status});
        
    } catch (error) {
        console.error("POST /business-day/open error:", error);
        return res.status(500).json({error:"Error al abrir el dia"})
        
    }

}

export const reopenBusinessDay = async (req, res) => {
    try {

        const {date} = req.body;
        if(!isYMD(date)){
            return res.status(400).json({error:"La fecha es requerida"})
        }

        const alreadyOpen = await BusinessDay.findOne({date, status:"open"});
        if(alreadyOpen){
            return res.status(409).json({error:`No se puede reabrir. hay un dia abierto (${alreadyOpen.date})`});
        }

        const day = await BusinessDay.findOne({date});
        if(!day) return res.status(404).json({error: `No existe el dia ${date}` });
        if(day.status != "closed"){
            return res.status(404).json({error: `El dia ${date} no esta cerrado (estado actual: ${day.status})`});
        }

        day.status ="open";
        day.closeBy= undefined;
        await day.save();

        return res.status(200).json({ok:true, date:day.date, status: day.status})
        
    } catch (error) {
            console.error("POST /business-day/reopen error:", error);
    return res.status(500).json({ error: "Error al reabrir el día" });
        
    }
}

export const closeBusinessDay = async (req, res) => {
  try {
    const { date, closeBy } = req.body;

    if (!date || !isYMD(date)) {
      return res.status(400).json({ error: "date es requerido en formato YYYY-MM-DD" });
    }
    if (!closeBy) {
      return res.status(400).json({ error: "closeBy es requerido" });
    }

    // Cierra SOLO el día abierto con esa fecha exacta (string)
    const closed = await BusinessDay.findOneAndUpdate(
      { status: "open", date },
      { $set: { status: "closed", closeBy, closedAt: new Date() } },
      { new: true }
    );

    if (!closed) {
      return res.status(409).json({ error: "No hay día abierto para esa fecha" });
    }

    return res.status(200).json(closed);
  } catch (error) {
    console.error("POST /business-day/close error:", error);
    return res.status(500).json({ error: "Error al cerrar el día" });
  }
};
