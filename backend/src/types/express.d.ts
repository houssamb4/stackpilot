import { Request } from 'express';
import { UserRole } from '../repositories/user.repository';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
