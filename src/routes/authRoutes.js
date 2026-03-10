const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post('/register', [
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    validateRequest
], authController.register);

router.post('/login', [
    body('username').notEmpty(),
    body('password').notEmpty(),
    validateRequest
], authController.login);

module.exports = router;
