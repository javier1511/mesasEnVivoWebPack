import { Router } from "express";
const router = Router();
import * as businessDayController  from "../controllers/businessDay.controller"
import { authJwt } from '../middlewares';



router.get("/", businessDayController.getBusinessDay );
router.post("/open", businessDayController.openBusinessDay)
router.post("/reopen", [authJwt.verifyToken, authJwt.isAdmin], businessDayController.reopenBusinessDay);
router.post("/close", businessDayController.closeBusinessDay);

export default router;