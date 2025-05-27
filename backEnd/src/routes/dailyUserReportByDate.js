import { Router } from "express";
const router = new Router();

import * as dailyReportUser from "../controllers/user.salesReport.controller.js";
import {authJwt} from "../middlewares"


router.get("/", authJwt.verifyToken, dailyReportUser.getUserReport);

export default router