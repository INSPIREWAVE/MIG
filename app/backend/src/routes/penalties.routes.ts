import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/penalties.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', ctrl.listPenalties);
router.post(
  '/',
  [body('loanId').isInt({ min: 1 }), body('amount').isFloat({ min: 0.01 }), body('reason').notEmpty()],
  validateRequest,
  ctrl.addPenalty,
);
router.put('/:id/status', [body('status').notEmpty()], validateRequest, ctrl.updatePenaltyStatus);
router.delete('/:id', ctrl.deletePenalty);
router.post('/apply-auto', ctrl.applyAutoPenalties);

export default router;
