import { Router } from 'express';
import { getCpuMetrics, getMemoryMetrics, getDiskMetrics, getNetworkMetrics, getNetworkInterfaces, testNetworkSpeed, getSystemLogs } from '../controllers/metrics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/cpu', authMiddleware, getCpuMetrics);
router.get('/memory', authMiddleware, getMemoryMetrics);
router.get('/disk', authMiddleware, getDiskMetrics);
router.get('/network', authMiddleware, getNetworkMetrics);
router.get('/network/interfaces', authMiddleware, getNetworkInterfaces);
router.post('/network/speedtest', authMiddleware, testNetworkSpeed);
router.get('/logs', authMiddleware, getSystemLogs);

export default router;
