const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./lib/prisma');

const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('Connected to the database successfully.');

        app.listen(config.port, () => {
            logger.info(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
