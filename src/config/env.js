require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
};

// Validate critical config
if (!config.databaseUrl) {
    console.error('CRITICAL ERROR: DATABASE_URL is not defined in .env');
    process.exit(1);
}

module.exports = config;
