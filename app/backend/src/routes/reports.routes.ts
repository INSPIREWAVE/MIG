import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/reports.controller';

const router = Router();

router.use(authenticateToken);

router.get('/dashboard', ctrl.getDashboard);
router.get('/payment-chart', ctrl.getPaymentChart);
router.get('/daily-collection', ctrl.getDailyCollection);
router.get('/profit', ctrl.getProfitReport);
router.get('/financial-advisory', ctrl.getFinancialAdvisory);
router.get('/batch-assessment', ctrl.runBatchAssessment);
router.post('/batch-assessment', ctrl.runBatchAssessment);

export default router;
