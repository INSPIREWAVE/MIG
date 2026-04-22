import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/loans.controller';

const router = Router();

router.use(authenticateToken);

router.get('/overdue', ctrl.getOverdueInstallments);
router.get('/upcoming', ctrl.getUpcomingInstallments);
router.get('/', ctrl.listLoans);
router.get('/:id', ctrl.getLoan);
router.post(
  '/',
  [
    body('clientId').isInt({ min: 1 }).withMessage('Valid clientId required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive'),
    body('interest').isFloat({ min: 0 }),
    body('loanDate').notEmpty(),
    body('dueDate').notEmpty(),
  ],
  validateRequest,
  ctrl.createLoan,
);
router.put('/:id', ctrl.updateLoan);
router.delete('/:id', requireRole('admin'), ctrl.deleteLoan);
router.get('/:id/installments', ctrl.getLoanInstallments);
router.get('/:id/payments', ctrl.getLoanPayments);
router.get('/:id/summary', ctrl.getLoanSummary);
router.post('/:id/recalculate', ctrl.recalculateLoan);
router.post('/:id/assess-default', ctrl.assessDefault);
router.get('/:id/early-settlement', ctrl.getEarlySettlement);
router.post('/:id/early-settle', ctrl.earlySettle);

export default router;
