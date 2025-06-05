// Archivo: src/middlewares/verifyNewPlayer.js
import Player from "../models/Players";

export const checkDuplicateMobile = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const registeredPlayer = await Player.findOne({ mobile });
    if (registeredPlayer) {
      const errorMessage = [];
      if (registeredPlayer.mobile === mobile) {
        errorMessage.push("El celular ya existe");
      }
      return res.status(400).json({ message: errorMessage });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al verificar datos duplicados", error: error.message });
  }
};

// Elimina este default si vas a usar sólo el named export
// export default checkDuplicateMobile;
