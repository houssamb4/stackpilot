import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

const getConfig = (): Config => {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '3306', 10),
    DATABASE_USER: process.env.DATABASE_USER || 'root',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASE_NAME: process.env.DATABASE_NAME || 'stackpilot-db',
  };
};

const validateConfig = (config: Config): void => {
  if (!config.JWT_SECRET && config.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production');
  }
  if (!config.DATABASE_PASSWORD && config.NODE_ENV === 'production') {
    throw new Error('DATABASE_PASSWORD must be defined in production');
  }
};

export const config = getConfig();
validateConfig(config);
