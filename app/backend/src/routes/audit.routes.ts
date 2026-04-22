import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/audit.controller';

const router = Router();

router.use(authenticateToken, requireRole('admin', 'manager'));

router.get('/', ctrl.listAuditLog);
router.delete('/', requireRole('admin'), ctrl.clearAuditLog);
router.delete('/:id', requireRole('admin'), ctrl.deleteAuditEntry);

export default router;
