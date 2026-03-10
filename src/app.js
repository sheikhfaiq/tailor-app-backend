const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middlewares/errorMiddleware');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (required for ngrok/proxies to work with express-rate-limit)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Request Logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Tailor App API is running / ٹیلر ایپ اے پی آئی چل رہی ہے',
        version: '1.0.0',
        docs: '/health'
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/measurements', require('./routes/measurementRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error Handling
app.use(errorMiddleware);

module.exports = app;
