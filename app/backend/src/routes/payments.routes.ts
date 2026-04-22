import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/payments.controller';

const router = Router();

router.use(authenticateToken);

router.get('/stats', ctrl.getPaymentStats);
router.get('/pipeline', ctrl.getPaymentPipeline);
router.get('/profit', ctrl.getProfitAnalysis);
router.get('/collection-trends', ctrl.getCollectionTrends);
router.get('/', ctrl.listPayments);
router.post(
  '/',
  [
    body('loanId').isInt({ min: 1 }),
    body('amount').isFloat({ min: 0.01 }),
    body('paymentDate').notEmpty(),
  ],
  validateRequest,
  ctrl.addPayment,
);
router.post('/:id/reverse', ctrl.reversePayment);

export default router;
