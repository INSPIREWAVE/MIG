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
        let payments = await adapter_1.db.getAllPayments();
        const { loanId, method, status } = req.query;
        if (loanId)
            payments = payments.filter((p) => p.loanId === parseInt(loanId, 10));
        if (method)
            payments = payments.filter((p) => p.paymentMethod === method || p.method === method);
        if (status)
            payments = payments.filter((p) => p.status === status);
        res.json({ success: true, data: payments });
    }
    catch (err) {
        next(err);
    }
}
async function addPayment(req, res, next) {
    try {
        const result = await adapter_1.db.allocatePayment(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Payment failed'), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_PAYMENT', 'payment', result.paymentId || result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function reversePayment(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { reason, reversedBy } = req.body;
        const result = await adapter_1.db.reversePayment(id, reason || '', reversedBy || '');
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Reversal failed'), { statusCode: 400 });
        adapter_1.db.logAudit('REVERSE_PAYMENT', 'payment', id, null, JSON.stringify({ reason }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentStats(req, res, next) {
    try {
        const result = await adapter_1.db.getPaymentStats(req.query.period);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentPipeline(req, res, next) {
    try {
        const days = parseInt(req.query.days || '7', 10);
        const result = await adapter_1.db.getPaymentPipeline(days);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getProfitAnalysis(req, res, next) {
    try {
        const result = await adapter_1.db.getProfitAnalysis(req.query.start, req.query.end);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getCollectionTrends(req, res, next) {
    try {
        const result = await adapter_1.db.getCollectionTrends();
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=payments.controller.js.map