import {Router} from "express"
const router = Router()
import * as countPlayersController from "../controllers/registerCount.controller.js"
import {authJwt} from "../middlewares"


router.get("/", authJwt.verifyToken, countPlayersController.getPlayersByDate);

export default router;