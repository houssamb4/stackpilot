import mysql from 'mysql2/promise';
import { config } from '../config/env';
import { logger } from '../config/logger';

let pool: mysql.Pool | null = null;

export const createPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
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

  return pool;
};

export const getConnection = async (): Promise<mysql.PoolConnection> => {
  const dbPool = createPool();
  return dbPool.getConnection();
};

export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const dbPool = createPool();
  const [rows] = await dbPool.execute(sql, params);
  return rows as T;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('MySQL pool closed');
  }
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};
