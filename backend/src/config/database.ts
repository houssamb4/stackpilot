import mysql from 'mysql2/promise';
import { config } from '../config/env';
import { logger } from '../config/logger';

let poolInstance: mysql.Pool | null = null;

export const createPool = (): mysql.Pool => {
  if (!poolInstance) {
    poolInstance = mysql.createPool({
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      user: config.DATABASE_USER,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    logger.info(`MySQL pool created for database: ${config.DATABASE_NAME}`);
  }

  return poolInstance;
};

// Export pool for direct access
export const pool = {
  query: async <T = any>(sql: string, params?: any[]): Promise<[T, any]> => {
    const dbPool = createPool();
    return dbPool.execute(sql, params) as Promise<[T, any]>;
  },
  execute: async <T = any>(sql: string, params?: any[]): Promise<[T, any]> => {
    const dbPool = createPool();
    return dbPool.execute(sql, params) as Promise<[T, any]>;
  },
  getConnection: async (): Promise<mysql.PoolConnection> => {
    const dbPool = createPool();
    return dbPool.getConnection();
  }
};

export const getConnection = async (): Promise<mysql.PoolConnection> => {
  return pool.getConnection();
};

export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const [rows] = await pool.query(sql, params);
  return rows as T;
};

export const closePool = async (): Promise<void> => {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    logger.info('MySQL pool closed');
  }
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};
