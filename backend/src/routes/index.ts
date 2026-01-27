import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import statsRoutes from './stats.routes';
import metricsRoutes from './metrics.routes';
import servicesRoutes from './services.routes';
import serversRoutes from './servers.routes';
import systemRoutes from './system.routes';
import { healthController } from '../health/health.controller';

const router = Router();

// Health check
router.get('/health', healthController);

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Stats routes
router.use('/stats', statsRoutes);

// Metrics routes (detailed system metrics)
router.use('/metrics', metricsRoutes);

// Services routes
router.use('/services', servicesRoutes);

// Servers routes
router.use('/servers', serversRoutes);

// System optimization routes
router.use('/system', systemRoutes);

export default router;
