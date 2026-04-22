"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPayments = listPayments;
exports.addPayment = addPayment;
exports.reversePayment = reversePayment;
exports.getPaymentStats = getPaymentStats;
exports.getPaymentPipeline = getPaymentPipeline;
exports.getProfitAnalysis = getProfitAnalysis;
exports.getCollectionTrends = getCollectionTrends;
const adapter_1 = require("../db/adapter");
async function listPayments(req, res, next) {
    try {
        const { loanId, startDate, endDate, method, status } = req.query;
        const result = await adapter_1.db.getAllPayments({
            loanId: loanId ? parseInt(loanId, 10) : undefined,
            startDate: startDate,
            endDate: endDate,
            method: method,
            status: status,
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.payments });
    }
    catch (err) {
        next(err);
    }
}
async function addPayment(req, res, next) {
    try {
        const result = await adapter_1.db.addPaymentEnhanced(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_PAYMENT', 'payment', result.paymentId, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function reversePayment(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { reason } = req.body;
        const result = await adapter_1.db.reversePayment(id, reason || '');
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('REVERSE_PAYMENT', 'payment', id, null, JSON.stringify({ reason }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentStats(req, res, next) {
    try {
        const { period } = req.query;
        const result = await adapter_1.db.getPaymentStats(period);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.stats });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentPipeline(req, res, next) {
    try {
        const result = await adapter_1.db.getPaymentPipeline();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.pipeline });
    }
    catch (err) {
        next(err);
    }
}
async function getProfitAnalysis(req, res, next) {
    try {
        const { startDate, endDate } = req.query;
        const result = await adapter_1.db.getProfitAnalysis(startDate, endDate);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getCollectionTrends(req, res, next) {
    try {
        const { months } = req.query;
        const result = await adapter_1.db.getCollectionTrends(months ? parseInt(months, 10) : 6);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=payments.controller.js.map