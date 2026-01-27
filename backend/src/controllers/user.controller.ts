import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import * as userService from '../services/user.service';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    const updatedUser = await userService.updateUser(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
