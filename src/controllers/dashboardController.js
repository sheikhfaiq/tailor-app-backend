const prisma = require('../lib/prisma');
const logger = require('../utils/logger');

const dashboardController = {
    async getStats(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const dateFilter = {};

            if (startDate || endDate) {
                dateFilter.createdAt = {};
                if (startDate) dateFilter.createdAt.gte = new Date(startDate);
                if (endDate) dateFilter.createdAt.lte = new Date(endDate);
            }

            const [pendingOrders, stitchingOrders, readyOrders, totalCustomers, incomeResult] = await Promise.all([
                prisma.order.count({ where: { status: 'PENDING', ...dateFilter } }),
                prisma.order.count({ where: { status: 'STITCHING', ...dateFilter } }),
                prisma.order.count({ where: { status: 'READY', ...dateFilter } }),
                prisma.customer.count({ where: dateFilter }),
                prisma.order.aggregate({
                    _sum: { totalPrice: true },
                    where: dateFilter
                })
            ]);

            res.status(200).json({
                status: 'success',
                data: {
                    pendingOrders,
                    stitchingOrders,
                    readyOrders,
                    totalCustomers,
                    totalIncome: incomeResult._sum.totalPrice || 0
                }
            });
        } catch (err) {
            logger.error(`Error fetching dashboard stats: ${err.message}`);
            next(err);
        }
    }
};

module.exports = dashboardController;
