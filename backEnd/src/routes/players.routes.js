// Archivo: src/routes/player.routes.js
import { Router } from "express";
import * as playerController from "../controllers/player.controller";
import { checkDuplicateMobile } from "../middlewares/verifyNewPlayer";

// Importa la función nombrada

const router = Router();

router.get("/", playerController.getPlayer);
router.post("/", [checkDuplicateMobile, playerController.createPlayer]);

export default router;
