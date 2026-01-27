import { Router } from 'express';
import { getServerStats } from '../controllers/stats.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Get server statistics (protected route)
router.get('/server', authMiddleware, getServerStats);

export default router;
