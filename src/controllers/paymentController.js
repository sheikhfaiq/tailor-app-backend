const paymentService = require('../services/paymentService');

const paymentController = {
    async record(req, res, next) {
        try {
            const payment = await paymentService.recordPayment(req.body);
            res.status(201).json({ status: 'success', data: payment });
        } catch (err) {
            next(err);
        }
    },

    async getByOrder(req, res, next) {
        try {
            const payments = await paymentService.getPaymentsByOrder(req.params.orderId);
            const balanceInfo = await paymentService.getBalance(req.params.orderId);
            res.status(200).json({
                status: 'success',
                data: {
                    payments,
                    summary: balanceInfo
                }
            });
        } catch (err) {
            next(err);
        }
    },

    async delete(req, res, next) {
        try {
            await paymentService.deletePayment(req.params.id);
            res.status(200).json({ status: 'success', message: 'Payment deleted' });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = paymentController;
