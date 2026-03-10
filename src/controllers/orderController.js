const orderService = require('../services/orderService');

const orderController = {
    async create(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json({ status: 'success', data: order });
        } catch (err) {
            next(err);
        }
    },

    async getById(req, res, next) {
        try {
            const order = await orderService.getOrder(req.params.id);
            res.status(200).json({ status: 'success', data: order });
        } catch (err) {
            next(err);
        }
    },

    async updateStatus(req, res, next) {
        try {
            const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
            res.status(200).json({ status: 'success', data: order });
        } catch (err) {
            next(err);
        }
    },

    async list(req, res, next) {
        try {
            const { page = 1, limit = 10, customerId, status, orderNumber } = req.query;
            const skip = (page - 1) * limit;
            const { orders, total } = await orderService.listOrders({
                skip: parseInt(skip),
                take: parseInt(limit),
                customerId,
                status,
                orderNumber,
            });

            res.status(200).json({
                status: 'success',
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit),
                },
                data: orders,
            });
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            await orderService.deleteOrder(req.params.id);
            res.status(200).json({ status: 'success', message: 'Order deleted' });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = orderController;
