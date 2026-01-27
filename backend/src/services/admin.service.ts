import * as userRepository from '../repositories/user.repository';

export const getPendingUsers = async () => {
  return userRepository.findPendingUsers();
};

export const getAllUsers = async () => {
  return userRepository.findAllUsers();
};

export const activateUser = async (userId: string, adminId: string) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isActive) {
    throw new Error('User is already active');
  }

  const success = await userRepository.activateUser(userId, adminId);
  
  if (!success) {
    throw new Error('Failed to activate user');
  }

  return {
    message: 'User activated successfully',
    userId,
  };
};

export const deactivateUser = async (userId: string) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActive) {
    throw new Error('User is already inactive');
  }

  const success = await userRepository.deactivateUser(userId);
  
  if (!success) {
    throw new Error('Failed to deactivate user');
  }

  return {
    message: 'User deactivated successfully',
    userId,
  };
};
