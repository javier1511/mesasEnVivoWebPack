import { Router } from 'express';
const router = Router();
import * as salesController from "../controllers/sales.controller";
import { authJwt } from '../middlewares';

router.get('/', authJwt.verifyToken, salesController.getSales);
router.get('/summary', authJwt.verifyToken, salesController.getSummaryByClient);
router.post('/', [authJwt.verifyToken, authJwt.isUser], salesController.createSales);
router.put('/:saleId', [authJwt.verifyToken, authJwt.isAdmin], salesController.updateSaleById);
router.get('/:saleId', [authJwt.verifyToken, authJwt.isUser, authJwt.isAdmin], salesController.getSalesById);
router.delete('/:saleId', [authJwt.verifyToken, authJwt.isAdmin], salesController.deleteSaleById);


export default router;
