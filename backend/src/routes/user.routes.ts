import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.use(authMiddleware);

router.get('/me', getMe);
router.put('/me', updateProfile);

export default router;
