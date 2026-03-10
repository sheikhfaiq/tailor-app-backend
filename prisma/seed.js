const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Admin User
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: passwordHash,
            role: 'ADMIN',
        },
    });
    console.log('Admin user created:', admin.username);

    // 2. Create Measurement Types
    const measurementTypes = [
        { nameEn: 'Length', nameUr: 'لمبائی', unit: 'inch' },
        { nameEn: 'Shoulder', nameUr: 'کندھا', unit: 'inch' },
        { nameEn: 'Sleeve', nameUr: 'آستین', unit: 'inch' },
        { nameEn: 'Chest', nameUr: 'چھاتی', unit: 'inch' },
        { nameEn: 'Collar', nameUr: 'کالر', unit: 'inch' },
        { nameEn: 'Waist', nameUr: 'کمر', unit: 'inch' },
        { nameEn: 'Hip', nameUr: 'ہپ', unit: 'inch' },
        { nameEn: 'Daman', nameUr: 'دامن', unit: 'inch' },
        { nameEn: 'Shalwar Length', nameUr: 'شلوار کی لمبائی', unit: 'inch' },
        { nameEn: 'Pancha', nameUr: 'پانچہ', unit: 'inch' },
    ];

    for (const type of measurementTypes) {
        await prisma.measurementType.upsert({
            where: { nameEn: type.nameEn },
            update: {},
            create: type,
        });
    }
    console.log('Measurement types created.');

    // 3. Create Sample Customer
    const customer = await prisma.customer.upsert({
        where: { phone: '03001234567' },
        update: {},
        create: {
            name: 'Zeeshan Khan',
            phone: '03001234567',
            address: 'DHA Phase 5, Lahore',
            notes: 'Prefers loose fitting.',
        },
    });
    console.log('Customer created:', customer.name);

    // 4. Create Customer Measurements
    const types = await prisma.measurementType.findMany();
    for (const type of types) {
        await prisma.customerMeasurement.upsert({
            where: {
                customerId_measurementTypeId: {
                    customerId: customer.id,
                    measurementTypeId: type.id
                }
            },
            update: {},
            create: {
                customerId: customer.id,
                measurementTypeId: type.id,
                value: (Math.floor(Math.random() * 20) + 15).toString() // Random test values
            }
        });
    }
    console.log('Customer measurements created.');

    // 5. Create Sample Order
    const order = await prisma.order.upsert({
        where: { orderNumber: 'TLR-100001' },
        update: {},
        create: {
            orderNumber: 'TLR-100001',
            customerId: customer.id,
            dressType: 'Shalwar Kameez',
            totalPrice: 2500,
            advance: 500,
            status: 'PENDING',
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            orderMeasurements: {
                create: [
                    { name: 'Length', value: '40' },
                    { name: 'Chest', value: '22' }
                ]
            },
            payments: {
                create: [
                    { amount: 500, method: 'CASH', notes: 'Advance payment' }
                ]
            }
        },
    });
    console.log('Order created:', order.orderNumber);

    console.log('Seeding complete! Admin UI and Mobile App can now use username: admin, password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
