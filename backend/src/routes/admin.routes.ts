import { Router } from 'express';
import { getPendingUsers, getAllUsers, activateUser, deactivateUser } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireSuperAdmin } from '../middlewares/admin.middleware';

const router = Router();

// All admin routes require authentication and super admin role
router.use(authMiddleware);
router.use(requireSuperAdmin);

// Get all users
router.get('/users', getAllUsers);

// Get pending users (waiting for activation)
router.get('/users/pending', getPendingUsers);

// Activate a user
router.put('/users/:userId/activate', activateUser);

// Deactivate a user
router.put('/users/:userId/deactivate', deactivateUser);

export default router;
