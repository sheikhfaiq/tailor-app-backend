const orderRepository = require('../repositories/orderRepository');
const measurementRepository = require('../repositories/measurementRepository');
const generateOrderNumber = require('../utils/generateOrderNumber');

const orderService = {
    async createOrder(data) {
        const { customerId, items, measurements, ...orderInfo } = data;

        // 1. Determine measurements to snapshot
        let measurementsToSnapshot = measurements;
        if (!measurementsToSnapshot || measurementsToSnapshot.length === 0) {
            // Fallback to customer default measurements if none provided in request
            const defaults = await measurementRepository.getByCustomerId(customerId);
            measurementsToSnapshot = defaults.map(m => ({
                name: m.type.nameEn,
                value: m.value
            }));
        }

        // 2. Generate unique order number
        const orderNumber = await generateOrderNumber();

        // 3. Create order with transaction
        return orderRepository.createWithSnapshot(
            { ...orderInfo, customerId, orderNumber },
            measurementsToSnapshot,
            items
        );
    },

    async getOrder(id) {
        const order = await orderRepository.findById(id);
        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }
        return order;
    },

    async updateOrderStatus(id, status) {
        const validStatuses = ['PENDING', 'STITCHING', 'READY', 'DELIVERED'];
        if (!validStatuses.includes(status)) {
            const error = new Error('Invalid status');
            error.statusCode = 400;
            throw error;
        }
        return orderRepository.updateStatus(id, status);
    },

    async listOrders(params) {
        return orderRepository.findAll(params);
    },

    async deleteOrder(id) {
        return orderRepository.delete(id);
    },
};

module.exports = orderService;
