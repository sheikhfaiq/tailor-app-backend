const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const config = require('../config/env');

const authController = {
    async register(req, res, next) {
        try {
            const { username, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    passwordHash: hashedPassword,
                    role: role || 'STAFF'
                }
            });

            res.status(201).json({ status: 'success', data: { id: user.id, username: user.username, role: user.role } });
        } catch (err) {
            if (err.code === 'P2002') {
                return res.status(400).json({ status: 'error', message: 'Username already exists' });
            }
            next(err);
        }
    },

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await prisma.user.findUnique({ where: { username } });

            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                config.jwtSecret,
                { expiresIn: '8h' }
            );

            res.status(200).json({ status: 'success', token, user: { id: user.id, username: user.username, role: user.role } });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = authController;
