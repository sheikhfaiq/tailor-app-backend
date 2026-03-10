const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearTemporaryData() {
    console.log('Starting data clearing process...');

    try {
        // Order matters due to foreign key constraints if they exist
        // However, since we want to KEEP Orders and Customers, we only clear their child records

        // 1. Clear Payments
        const payments = await prisma.payment.deleteMany({});
        console.log(`Cleared ${payments.count} payments.`);

        // 2. Clear Order Measurements (Snapshots)
        const orderMeasurements = await prisma.orderMeasurement.deleteMany({});
        console.log(`Cleared ${orderMeasurements.count} order measurements.`);

        // 3. Clear Order Items
        const orderItems = await prisma.orderItem.deleteMany({});
        console.log(`Cleared ${orderItems.count} order items.`);

        // 4. Clear Customer Measurements (Defaults)
        const customerMeasurements = await prisma.customerMeasurement.deleteMany({});
        console.log(`Cleared ${customerMeasurements.count} customer measurements.`);

        console.log('-----------------------------------');
        console.log('Data clearing completed successfully!');
        console.log('Preserved: Users, Customers, Orders, MeasurementTypes');

    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearTemporaryData();
