const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const validateRequest = require('../middlewares/validateRequest');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

const paymentValidation = [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('amount').isDecimal().withMessage('Amount must be a decimal'),
    body('method').isIn(['CASH', 'CARD', 'ONLINE']).withMessage('Invalid payment method'),
    validateRequest,
];

router.post('/', paymentValidation, paymentController.record);
router.get('/order/:orderId', paymentController.getByOrder);
router.delete('/:id', paymentController.delete);

module.exports = router;
