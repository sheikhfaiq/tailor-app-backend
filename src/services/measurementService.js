const measurementRepository = require('../repositories/measurementRepository');

const measurementService = {
    async createType(data) {
        return measurementRepository.createType(data);
    },

    async listTypes() {
        return measurementRepository.getAllTypes();
    },

    async deleteType(id) {
        return measurementRepository.deleteType(id);
    },

    async saveBatch(customerId, measurements) {
        // measurements = [{ typeId: 1, value: "40" }, ...]
        const results = [];
        for (const m of measurements) {
            const res = await measurementRepository.upsertCustomerMeasurement(
                customerId,
                m.measurementTypeId,
                m.value
            );
            results.push(res);
        }
        return results;
    },

    async getCustomerMeasurements(customerId) {
        return measurementRepository.getByCustomerId(customerId);
    },
};

module.exports = measurementService;
