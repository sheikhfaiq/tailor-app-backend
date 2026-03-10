const express = require('express');
const { body } = require('express-validator');
const measurementController = require('../controllers/measurementController');
const validateRequest = require('../middlewares/validateRequest');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

// Types (Admin only for creation/deletion suggested by role logic)
router.get('/types', measurementController.listTypes);
router.post('/types', [
    authorizeRoles(['ADMIN']),
    body('nameEn').notEmpty(),
    body('nameUr').notEmpty(),
    validateRequest
], measurementController.createType);

router.delete('/types/:id', authorizeRoles(['ADMIN']), measurementController.deleteType);

// Customer Specific Measurements
router.get('/customer/:customerId', measurementController.getByCustomer);
router.post('/customer/:customerId', [
    body('measurements').isArray().withMessage('Measurements must be an array'),
    body('measurements.*.measurementTypeId').notEmpty(),
    body('measurements.*.value').notEmpty(),
    validateRequest
], measurementController.saveCustomerBatch);

module.exports = router;
