import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/collateral.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', ctrl.listCollateral);
router.get('/loan/:loanId', ctrl.getCollateralByLoan);
router.get('/client/:clientId', ctrl.getCollateralByClient);
router.post(
  '/',
  [
    body('clientId').isInt({ min: 1 }),
    body('loanId').isInt({ min: 1 }),
    body('itemType').notEmpty(),
    body('estimatedValue').isFloat({ min: 0 }),
  ],
  validateRequest,
  ctrl.addCollateral,
);
router.put('/:id', ctrl.updateCollateral);
router.delete('/:id', ctrl.deleteCollateral);
router.post('/:id/forfeit', ctrl.forfeitCollateral);

export default router;
