const prisma = require('../lib/prisma');

const measurementRepository = {
    // Measurement Types
    async createType(data) {
        return prisma.measurementType.create({ data });
    },

    async getAllTypes() {
        return prisma.measurementType.findMany({
            orderBy: { nameEn: 'asc' },
        });
    },

    async deleteType(id) {
        return prisma.measurementType.delete({
            where: { id: parseInt(id) },
        });
    },

    // Customer Measurements
    async upsertCustomerMeasurement(customerId, measurementTypeId, value) {
        return prisma.customerMeasurement.upsert({
            where: {
                customerId_measurementTypeId: {
                    customerId: parseInt(customerId),
                    measurementTypeId: parseInt(measurementTypeId),
                },
            },
            update: { value },
            create: {
                customerId: parseInt(customerId),
                measurementTypeId: parseInt(measurementTypeId),
                value,
            },
            include: { type: true },
        });
    },

    async getByCustomerId(customerId) {
        return prisma.customerMeasurement.findMany({
            where: { customerId: parseInt(customerId) },
            include: { type: true },
        });
    },
};

module.exports = measurementRepository;
