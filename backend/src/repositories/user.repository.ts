import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type UserRole = 'super_admin' | 'admin' | 'user';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  activatedAt: Date | null;
  activatedBy: string | null;
  createdAt: Date;
}

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  is_active: number;
  activated_at: Date | null;
  activated_by: string | null;
  created_at: Date;
}

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const users = await query<UserRow[]>(
    'SELECT id, email, password, name, role, is_active, activated_at, activated_by, created_at FROM users WHERE email = ?',
    [email]
  );
  
  if (users.length === 0) {
    return undefined;
  }

  const user = users[0];
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role,
    isActive: Boolean(user.is_active),
    activatedAt: user.activated_at,
    activatedBy: user.activated_by,
    createdAt: user.created_at,
  };
};

export const findById = async (id: string): Promise<User | undefined> => {
  const users = await query<UserRow[]>(
    'SELECT id, email, password, name, role, is_active, activated_at, activated_by, created_at FROM users WHERE id = ?',
    [id]
  );
  
  if (users.length === 0) {
    return undefined;
  }

  const user = users[0];
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role,
    isActive: Boolean(user.is_active),
    activatedAt: user.activated_at,
    activatedBy: user.activated_by,
    createdAt: user.created_at,
  };
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive' | 'activatedAt' | 'activatedBy'>): Promise<User> => {
  const id = uuidv4();
  const now = new Date();

  await query<ResultSetHeader>(
    'INSERT INTO users (id, email, password, name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)',
    [id, userData.email, userData.password, userData.name, userData.role, now]
  );

  return {
    id,
    ...userData,
    isActive: false,
    activatedAt: null,
    activatedBy: null,
    createdAt: now,
  };
};

export const updateUser = async (
  id: string,
  updates: Partial<Pick<User, 'name' | 'email'>>
): Promise<User | undefined> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }

  if (updates.email !== undefined) {
    fields.push('email = ?');
    values.push(updates.email);
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  await query<ResultSetHeader>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return findById(id);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
};

export const activateUser = async (userId: string, activatedBy: string): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE users SET is_active = 1, activated_at = CURRENT_TIMESTAMP, activated_by = ? WHERE id = ?',
    [activatedBy, userId]
  );

  return result.affectedRows > 0;
};

export const deactivateUser = async (userId: string): Promise<boolean> => {
  const result = await query<ResultSetHeader>(
    'UPDATE users SET is_active = 0 WHERE id = ?',
    [userId]
  );

  return result.affectedRows > 0;
};

export const findPendingUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const users = await query<UserRow[]>(
    'SELECT id, email, name, role, is_active, activated_at, activated_by, created_at FROM users WHERE is_active = 0 ORDER BY created_at DESC'
  );

  return users.map(user => ({
    id: user.id,
    email: user.email,
    password: '',
    name: user.name,
    role: user.role,
    isActive: Boolean(user.is_active),
    activatedAt: user.activated_at,
    activatedBy: user.activated_by,
    createdAt: user.created_at,
  }));
};

export const findAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const users = await query<UserRow[]>(
    'SELECT id, email, name, role, is_active, activated_at, activated_by, created_at FROM users ORDER BY created_at DESC'
  );

  return users.map(user => ({
    id: user.id,
    email: user.email,
    password: '',
    name: user.name,
    role: user.role,
    isActive: Boolean(user.is_active),
    activatedAt: user.activated_at,
    activatedBy: user.activated_by,
    createdAt: user.created_at,
  }));
};
