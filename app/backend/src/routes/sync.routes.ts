import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/sync.controller';

const router = Router();

router.get('/status', ctrl.getStatus);
router.use(authenticateToken);
router.post('/push', ctrl.pushSync);
router.get('/pull', ctrl.pullSync);

export default router;
