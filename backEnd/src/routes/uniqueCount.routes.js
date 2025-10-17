import { Router } from "express";
const router = Router();
import * as aforoController from "../controllers/uniqueCount.controller";
import {authJwt} from "../middlewares"



router.get('/', authJwt.verifyToken, aforoController.getUniquePlayersByDate);

export default router