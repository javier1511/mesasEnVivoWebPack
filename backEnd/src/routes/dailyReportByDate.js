import {Router} from  "express";
const router = Router();
import * as dailyReportByDate from "../controllers/report.sales.controller.js"

router.get("/", dailyReportByDate.getSalesReport);

export default router;