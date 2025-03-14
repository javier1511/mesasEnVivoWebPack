import {Router} from "express"
const router = Router()
import * as countPlayersController from "../controllers/registerCount.controller.js"

router.get("/", countPlayersController.getPlayersByDate);

export default router;