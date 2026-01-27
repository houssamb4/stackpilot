import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { testConnection } from './config/database';
import { systemOptimizer } from './services/system.optimizer';
import { sessionManager } from './services/session.manager';

const PORT = config.PORT;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Database: ${config.DATABASE_NAME} on ${config.DATABASE_HOST}:${config.DATABASE_PORT}`);
      logger.info('⚡ Session-based optimization enabled - server will conserve resources when idle');
    });

    // Register cleanup on shutdown
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const cleanup = () => {
  logger.info('Server shutting down...');
  systemOptimizer.stop();
  sessionManager.stop();
  process.exit(0);
};

startServer();
