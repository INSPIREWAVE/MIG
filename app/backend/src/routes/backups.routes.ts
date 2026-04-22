import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/backups.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', ctrl.listBackups);
router.post('/', ctrl.createBackup);
router.post('/:id/restore', requireRole('admin'), ctrl.restoreBackup);
router.delete('/:id', requireRole('admin'), ctrl.deleteBackup);

export default router;
