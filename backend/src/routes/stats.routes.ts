import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Get server statistics (protected route)
router.get('/server', authenticateToken, (req, res) => 
  statsController.getServerStats(req, res)
);

export default router;
