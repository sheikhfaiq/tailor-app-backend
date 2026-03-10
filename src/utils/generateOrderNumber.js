const prisma = require('../lib/prisma');

/**
 * Generates a unique order number in the format TLR-000001
 * Uses a simple count-based approach for this implementation.
 * In production, you might want a more robust sequence or dedicated table.
 */
const generateOrderNumber = async () => {
    const count = await prisma.order.count();
    const nextId = count + 1;
    return `TLR-${nextId.toString().padStart(6, '0')}`;
};

module.exports = generateOrderNumber;
