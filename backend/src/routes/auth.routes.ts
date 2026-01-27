import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', loginRateLimiter, login);
router.post('/register', register);

export default router;
