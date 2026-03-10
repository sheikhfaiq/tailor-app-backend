const prisma = require('../lib/prisma');

const orderRepository = {
    async createWithSnapshot(orderData, measurements, items) {
        return prisma.$transaction(async (tx) => {
            // 1. Create the Order
            const order = await tx.order.create({
                data: {
                    ...orderData,
                    customerId: parseInt(orderData.customerId),
                    deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
                },
            });

            // 2. Create Order Measurement Snapshots
            if (measurements && measurements.length > 0) {
                await tx.orderMeasurement.createMany({
                    data: measurements.map((m) => ({
                        orderId: order.id,
                        name: m.name || (m.type ? m.type.nameEn : 'Unknown'),
                        value: m.value,
                    })),
                });
            }

            // 3. Create Order Items
            if (items && items.length > 0) {
                await tx.orderItem.createMany({
                    data: items.map((i) => ({
                        orderId: order.id,
                        itemName: i.itemName,
                        quantity: i.quantity || 1,
                        price: i.price,
                    })),
                });
            }

            return tx.order.findUnique({
                where: { id: order.id },
                include: { orderMeasurements: true, orderItems: true, customer: true },
            });
        });
    },

    async findById(id) {
        return prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { orderMeasurements: true, orderItems: true, customer: true, payments: true },
        });
    },

    async updateStatus(id, status) {
        return prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        });
    },

    async findAll({ skip = 0, take = 10, customerId, status, orderNumber }) {
        const where = {};
        if (customerId) where.customerId = parseInt(customerId);
        if (status) where.status = status;
        if (orderNumber) where.orderNumber = { contains: orderNumber };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { customer: true },
            }),
            prisma.order.count({ where }),
        ]);

        return { orders, total };
    },

    async delete(id) {
        // Prisma cascading delete should be handled in schema or manually
        // For now, simple delete of the order (and linked items via schema relation if configured)
        return prisma.order.delete({
            where: { id: parseInt(id) },
        });
    },
};

module.exports = orderRepository;
