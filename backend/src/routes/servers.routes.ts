import { Router } from 'express';
import {
  getAllServers,
  getServer,
  createServer,
  updateServer,
  deleteServer,
  restartServerUptime,
} from '../controllers/servers.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllServers);
router.get('/:id', getServer);
router.post('/', createServer);
router.put('/:id', updateServer);
router.delete('/:id', deleteServer);
router.post('/:id/restart-uptime', restartServerUptime);

export default router;
