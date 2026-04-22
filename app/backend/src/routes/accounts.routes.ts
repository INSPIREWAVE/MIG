import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/accounts.controller';

const router = Router();

router.use(authenticateToken);

router.get('/transactions', ctrl.listTransactions);
router.post(
  '/transactions',
  [body('amount').isFloat({ min: 0.01 }), body('transactionType').notEmpty()],
  validateRequest,
  ctrl.addTransaction,
);
router.get('/balance-sheets', ctrl.listBalanceSheets);
router.post('/balance-sheets', ctrl.generateBalanceSheet);
router.get('/', ctrl.listAccounts);
router.post(
  '/',
  [body('accountName').notEmpty(), body('accountType').notEmpty()],
  validateRequest,
  ctrl.createAccount,
);
router.put('/:id', ctrl.updateAccount);
router.delete('/:id', requireRole('admin', 'manager'), ctrl.deleteAccount);

export default router;
