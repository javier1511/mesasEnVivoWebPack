import {Router} from  "express";
const router = Router();
import * as dailyReportByDate from "../controllers/report.sales.controller.js"
import {authJwt} from "../middlewares"


router.get("/", authJwt.verifyToken, dailyReportByDate.getSalesReport);

export default router;