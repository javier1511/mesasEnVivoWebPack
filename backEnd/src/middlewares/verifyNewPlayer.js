import Players from "../models/Players";

export const checkDuplicateMobile = async (req, res, next) => {
    try {
        const { mobile, email } = req.body;

        // Buscar jugador por móvil o correo electrónico
        const registeredPlayer = await Players.findOne({
            $or: [{ mobile }, { email }]
        });

        if (registeredPlayer) {
            // Verificar si el móvil o el correo ya están registrados
            const errorMessage = [];
            if (registeredPlayer.mobile === mobile) errorMessage.push("El celular ya existe");
            if (registeredPlayer.email === email) errorMessage.push("El email ya existe");

            return res.status(400).json({ message: errorMessage.join(" y ") });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Error al verificar datos duplicados", error: error.message });
    }
};
