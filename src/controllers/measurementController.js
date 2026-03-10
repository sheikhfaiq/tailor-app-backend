const measurementService = require('../services/measurementService');

const measurementController = {
    async createType(req, res, next) {
        try {
            const type = await measurementService.createType(req.body);
            res.status(201).json({ status: 'success', data: type });
        } catch (err) {
            next(err);
        }
    },

    async listTypes(req, res, next) {
        try {
            const types = await measurementService.listTypes();
            res.status(200).json({ status: 'success', data: types });
        } catch (err) {
            next(err);
        }
    },

    async deleteType(req, res, next) {
        try {
            await measurementService.deleteType(req.params.id);
            res.status(200).json({ status: 'success', message: 'Type deleted' });
        } catch (err) {
            next(err);
        }
    },

    async saveCustomerBatch(req, res, next) {
        try {
            const { customerId } = req.params;
            const { measurements } = req.body; // Array of { typeId, value }
            const results = await measurementService.saveBatch(customerId, measurements);
            res.status(200).json({ status: 'success', data: results });
        } catch (err) {
            next(err);
        }
    },

    async getByCustomer(req, res, next) {
        try {
            const data = await measurementService.getCustomerMeasurements(req.params.customerId);
            res.status(200).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = measurementController;
