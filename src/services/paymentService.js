const paymentRepository = require('../repositories/paymentRepository');

const paymentService = {
    async recordPayment(data) {
        return paymentRepository.create(data);
    },

    async getPaymentsByOrder(orderId) {
        return paymentRepository.findByOrderId(orderId);
    },

    async getBalance(orderId) {
        const result = await paymentRepository.getOrderBalance(orderId);
        if (!result) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }
        return result;
    },

    async deletePayment(id) {
        return paymentRepository.delete(id);
    },
};

module.exports = paymentService;
