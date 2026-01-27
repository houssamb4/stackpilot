import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../repositories/user.repository';

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
