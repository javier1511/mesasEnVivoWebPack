import { Router } from "express";
const router = Router();
import * as businessDayController  from "../controllers/businessDay.controller"


router.get("/", businessDayController.getBusinessDay );
router.post("/open", businessDayController.openBusinessDay)
router.post("/reopen", businessDayController.reopenBusinessDay);
router.post("/close", businessDayController.closeBusinessDay);

export default router;