import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/settings.controller';

const router = Router();

router.use(authenticateToken);

router.get('/:key', ctrl.getSetting);
router.post('/', ctrl.setSetting);

export default router;
