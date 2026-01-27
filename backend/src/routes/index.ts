import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
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

export default router;
