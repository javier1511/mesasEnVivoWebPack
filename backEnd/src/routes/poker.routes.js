import { Router } from "express";
const router = new Router();
import * as pokerController from "../controllers/salesPoker.controller";
import {authJwt} from "../middlewares"

router.get('/', authJwt.verifyToken, pokerController.getPokerSale);
router.post('/', [authJwt.verifyToken, authJwt.isUser], pokerController.createPokerSale);
router.put('/:pokerId', [authJwt.verifyToken, authJwt.isAdmin], pokerController.updatePokerSaleById);
router.get('/:pokerId', [authJwt.verifyToken, authJwt.isUser], pokerController.getPokerSaleById);
router.delete('/:pokerId', [authJwt.verifyToken, authJwt.isAdmin], pokerController.deletePokerSaleById);


export default router;

