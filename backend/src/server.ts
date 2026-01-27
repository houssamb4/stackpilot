import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
});
