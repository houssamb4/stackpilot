import { Router } from 'express';
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  startService,
  stopService,
  getServiceLogs,
} from '../controllers/services.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAllServices);
router.get('/:id', authMiddleware, getService);
router.post('/', authMiddleware, createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);
router.post('/:id/start', authMiddleware, startService);
router.post('/:id/stop', authMiddleware, stopService);
router.get('/:id/logs', authMiddleware, getServiceLogs);

export default router;
