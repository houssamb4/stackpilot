import * as userRepository from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { UserRole } from '../repositories/user.repository';

export const register = async (email: string, password: string, name: string, role: UserRole = 'admin') => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user (is_active = 0 by default)
  const user = await userRepository.createUser({
    email,
    password: hashedPassword,
    name,
    role,
  });

  return {
    message: 'Registration successful. Please wait for admin approval to activate your account.',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    },
  };
};

export const login = async (email: string, password: string) => {
  // Find user
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Your account is pending approval. Please wait for admin activation.');
  }

  // Verify password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    },
    token,
  };
};
