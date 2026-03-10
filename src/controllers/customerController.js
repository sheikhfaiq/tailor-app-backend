const customerService = require('../services/customerService');
const logger = require('../utils/logger');

const customerController = {
    async create(req, res, next) {
        try {
            const customer = await customerService.createCustomer(req.body);
            res.status(201).json({ status: 'success', data: customer });
        } catch (err) {
            next(err);
        }
    },

    async getById(req, res, next) {
        try {
            const customer = await customerService.getCustomerById(req.params.id);
            res.status(200).json({ status: 'success', data: customer });
        } catch (err) {
            next(err);
        }
    },

    async update(req, res, next) {
        try {
            const customer = await customerService.updateCustomer(req.params.id, req.body);
            res.status(200).json({ status: 'success', data: customer });
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            await customerService.deleteCustomer(req.params.id);
            res.status(200).json({ status: 'success', message: 'Customer deleted successfully' });
        } catch (err) {
            next(err);
        }
    },

    async list(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (page - 1) * limit;
            const { customers, total } = await customerService.listCustomers({
                skip: parseInt(skip),
                take: parseInt(limit),
                search
            });

            res.status(200).json({
                status: 'success',
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit),
                },
                data: customers,
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = customerController;
