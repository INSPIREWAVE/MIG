import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/users.controller';

const router = Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/', ctrl.listUsers);
router.put(
  '/:id/role',
  [body('role').isIn(['admin', 'manager', 'user', 'viewer'])],
  validateRequest,
  ctrl.updateUserRole,
);
router.put('/:id/status', [body('isActive').isBoolean()], validateRequest, ctrl.toggleUserStatus);
router.delete('/:id', ctrl.deleteUser);

export default router;
