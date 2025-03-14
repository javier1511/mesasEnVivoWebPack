import { Router } from "express";
const router = Router();

import * as authCtrl from  '../controllers/auth.controller'
import { authJwt, verifySignup } from "../middlewares";

router.post('/signup',[authJwt.verifyToken, verifySignup.checkDuplicateUsername, verifySignup.checkRolesExisted], authCtrl.signUp)
 router.post('/signin', authCtrl.signIn)

export default router;