import { Router } from "express";
import { sendSMS } from '../controllers/sms.controller.js'; // ✅ Importación correcta

const router = Router();
import { authJwt } from '../middlewares';

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], sendSMS); // ✅ Llamada a la función correctamente

export default router;
