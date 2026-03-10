const customerRepository = require('../repositories/customerRepository');
const measurementRepository = require('../repositories/measurementRepository');

const customerService = {
    async createCustomer(data) {
        const { measurements, ...customerData } = data;
        const existing = await customerRepository.findByPhone(customerData.phone);
        if (existing) {
            const error = new Error('Customer with this phone number already exists');
            error.statusCode = 400;
            throw error;
        }
        const customer = await customerRepository.create(customerData);

        if (measurements && measurements.length > 0) {
            for (const m of measurements) {
                await measurementRepository.upsertCustomerMeasurement(customer.id, m.typeId, m.value);
            }
        }

        return customer;
    },

    async getCustomerById(id) {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        return customer;
    },

    async updateCustomer(id, data) {
        // Check if phone is being updated to an existing one
        if (data.phone) {
            const existing = await customerRepository.findByPhone(data.phone);
            if (existing && existing.id !== parseInt(id)) {
                const error = new Error('Phone number already taken by another customer');
                error.statusCode = 400;
                throw error;
            }
        }
        return customerRepository.update(id, data);
    },

    async deleteCustomer(id) {
        try {
            return await customerRepository.delete(id);
        } catch (err) {
            const error = new Error('Could not delete customer. They might have linked orders.');
            error.statusCode = 400;
            throw error;
        }
    },

    async listCustomers(params) {
        return customerRepository.findAll(params);
    },
};

module.exports = customerService;
