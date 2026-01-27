import { Router } from 'express';
import { sessionManager } from '../services/session.manager';
import { systemOptimizer } from '../services/system.optimizer';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Get system optimization status
router.get('/status', (req, res) => {
  const sessionStats = sessionManager.getStats();
  const optimizerStatus = systemOptimizer.getStatus();

  res.json({
    sessions: sessionStats,
    optimizer: optimizerStatus,
    serverStatus: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  });
});

export default router;
