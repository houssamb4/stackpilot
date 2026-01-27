// This is a mock repository using in-memory storage
// Replace with actual database implementation (e.g., Prisma, TypeORM, etc.)

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// In-memory storage (replace with database)
let users: User[] = [];

export const findByEmail = async (email: string): Promise<User | undefined> => {
  return users.find(user => user.email === email);
};

export const findById = async (id: string): Promise<User | undefined> => {
  return users.find(user => user.id === id);
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const user: User = {
    id: Math.random().toString(36).substring(7),
    ...userData,
    createdAt: new Date(),
  };
  
  users.push(user);
  return user;
};

export const updateUser = async (
  id: string,
  updates: Partial<Pick<User, 'name' | 'email'>>
): Promise<User | undefined> => {
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return undefined;
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
};
