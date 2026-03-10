const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const validateRequest = require('../middlewares/validateRequest');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

const orderValidation = [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('dressType').notEmpty().withMessage('Dress type is required'),
    body('totalPrice').isDecimal().withMessage('Total price must be a decimal'),
    body('advance').optional().isDecimal(),
    body('items').optional().isArray(),
    body('items.*.itemName').notEmpty(),
    body('items.*.price').isDecimal(),
    validateRequest,
];

router.post('/', orderValidation, orderController.create);
router.get('/', orderController.list);
router.get('/:id', orderController.getById);
router.patch('/:id/status', [
    body('status').notEmpty(),
    validateRequest
], orderController.updateStatus);
router.delete('/:id', orderController.delete);

module.exports = router;
