import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import * as adminService from '../services/admin.service';

export const getPendingUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getPendingUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await adminService.activateUser(userId, adminId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const result = await adminService.deactivateUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
