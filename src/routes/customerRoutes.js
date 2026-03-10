const express = require('express');
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');
const validateRequest = require('../middlewares/validateRequest');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

const customerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').optional().isString(),
    body('notes').optional().isString(),
    validateRequest,
];

router.post('/', customerValidation, customerController.create);
router.get('/', customerController.list);
router.get('/:id', customerController.getById);
router.put('/:id', customerValidation, customerController.update);
router.delete('/:id', customerController.delete);

module.exports = router;
