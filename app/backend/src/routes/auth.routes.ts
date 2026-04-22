import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/auth.controller';

const router = Router();

router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty()],
  validateRequest,
  ctrl.login,
);

router.post('/refresh', ctrl.refresh);

router.post('/logout', ctrl.logout);

router.post(
  '/register',
  authenticateToken,
  requireRole('admin'),
  [
    body('username').notEmpty().isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'manager', 'user', 'viewer']),
  ],
  validateRequest,
  ctrl.register,
);

router.post(
  '/recover',
  [body('username').notEmpty(), body('secAnswer').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  ctrl.recover,
);

router.post(
  '/change-password',
  authenticateToken,
  [body('oldPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  ctrl.changePassword,
);

router.get('/me', authenticateToken, ctrl.me);

export default router;
