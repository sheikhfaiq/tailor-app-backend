const prisma = require('../lib/prisma');

const customerRepository = {
    async create(data) {
        return prisma.customer.create({ data });
    },

    async findByPhone(phone) {
        return prisma.customer.findUnique({ where: { phone } });
    },

    async findById(id) {
        return prisma.customer.findUnique({
            where: { id: parseInt(id) },
            include: { customerMeasurements: { include: { type: true } } }
        });
    },

    async update(id, data) {
        return prisma.customer.update({
            where: { id: parseInt(id) },
            data,
        });
    },

    async delete(id) {
        return prisma.customer.delete({
            where: { id: parseInt(id) },
        });
    },

    async findAll({ skip = 0, take = 10, search = '' }) {
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ],
        } : {};

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.customer.count({ where }),
        ]);

        return { customers, total };
    },
};

module.exports = customerRepository;
