import { Router } from 'express';
import { getServerStats } from '../controllers/stats.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/server', authMiddleware, getServerStats);

export default router;
