const prisma = require('../lib/prisma');

const paymentRepository = {
    async create(data) {
        return prisma.payment.create({
            data: {
                ...data,
                orderId: parseInt(data.orderId),
            },
            include: { order: true },
        });
    },

    async findByOrderId(orderId) {
        return prisma.payment.findMany({
            where: { orderId: parseInt(orderId) },
            orderBy: { paidAt: 'desc' },
        });
    },

    async getOrderBalance(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { payments: true },
        });

        if (!order) return null;

        const totalPaid = order.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const balance = parseFloat(order.totalPrice) - totalPaid;

        return {
            totalPrice: order.totalPrice,
            totalPaid,
            balance,
        };
    },

    async delete(id) {
        return prisma.payment.delete({
            where: { id: parseInt(id) },
        });
    },
};

module.exports = paymentRepository;
