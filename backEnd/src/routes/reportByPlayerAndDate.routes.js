import {Router} from  "express";
const router = Router();
import * as reportByPlayerAndDate from "../controllers/report.sales.controller.js"
import {authJwt} from "../middlewares"


router.get("/", authJwt.verifyToken, reportByPlayerAndDate.getSalesReportByDateAndName);

export default router;