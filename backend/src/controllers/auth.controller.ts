import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { recordFailedAttempt, clearRateLimit } from '../middlewares/rateLimiter.middleware';
import { logger } from '../config/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Basic input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const clientIp = (req as any).clientIp || 'unknown';

    if (!email || !password) {
      recordFailedAttempt(req);
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const result = await authService.login(email, password);
      
      // Successful login - clear rate limit
      clearRateLimit(req);
      logger.info(`Successful login for user: ${email} from IP: ${clientIp}`);
      
      res.status(200).json(result);
    } catch (authError) {
      // Failed login - record attempt
      recordFailedAttempt(req);
      logger.warn(`Failed login attempt for email: ${email} from IP: ${clientIp} - ${authError}`);
      
      // Generic error message to prevent user enumeration
      return res.status(401).json({ 
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    next(error);
  }
};
