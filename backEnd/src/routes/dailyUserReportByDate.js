import { Router } from "express";
const router = new Router();

import * as dailyReportUser from "../controllers/user.salesReport.controller.js";

router.get("/", dailyReportUser.getUserReport);

export default router