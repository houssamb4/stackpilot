import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};
