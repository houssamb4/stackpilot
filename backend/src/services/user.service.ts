import * as userRepository from '../repositories/user.repository';

export const getUserById = async (id: string) => {
  const user = await userRepository.findById(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Don't return password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (id: string, updates: Partial<{ name: string; email: string }>) => {
  const user = await userRepository.updateUser(id, updates);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Don't return password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
