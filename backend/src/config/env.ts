import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_URL?: string;
}

const getConfig = (): Config => {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    DATABASE_URL: process.env.DATABASE_URL,
  };
};

const validateConfig = (config: Config): void => {
  if (!config.JWT_SECRET && config.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production');
  }
};

export const config = getConfig();
validateConfig(config);
