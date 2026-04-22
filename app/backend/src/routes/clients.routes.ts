import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/clients.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', ctrl.listClients);
router.get('/:id', ctrl.getClient);
router.post(
  '/',
  [body('name').notEmpty().withMessage('Name is required')],
  validateRequest,
  ctrl.createClient,
);
router.put('/:id', ctrl.updateClient);
router.delete('/:id', requireRole('admin'), ctrl.deleteClient);
router.get('/:id/loans', ctrl.getClientLoans);
router.get('/:id/documents', ctrl.getClientDocuments);
router.get('/:id/activity', ctrl.getClientActivity);
router.get('/:id/stats', ctrl.getClientStats);
router.post('/:id/kyc', [body('kycStatus').notEmpty()], validateRequest, ctrl.updateKycStatus);
router.post('/:id/blacklist', ctrl.toggleBlacklist);

export default router;
