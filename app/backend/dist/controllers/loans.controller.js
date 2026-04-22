"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLoans = listLoans;
exports.getLoan = getLoan;
exports.createLoan = createLoan;
exports.updateLoan = updateLoan;
exports.deleteLoan = deleteLoan;
exports.getLoanInstallments = getLoanInstallments;
exports.getLoanPayments = getLoanPayments;
exports.getLoanSummary = getLoanSummary;
exports.recalculateLoan = recalculateLoan;
exports.assessDefault = assessDefault;
exports.getEarlySettlement = getEarlySettlement;
exports.earlySettle = earlySettle;
exports.getOverdueInstallments = getOverdueInstallments;
exports.getUpcomingInstallments = getUpcomingInstallments;
const adapter_1 = require("../db/adapter");
async function listLoans(req, res, next) {
    try {
        const { status, clientId, search } = req.query;
        const result = await adapter_1.db.getLoans({
            status: status,
            clientId: clientId ? parseInt(clientId, 10) : undefined,
            search: search,
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.loans });
    }
    catch (err) {
        next(err);
    }
}
async function getLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getLoanDetails(id);
        if (!result.success)
            throw Object.assign(new Error(result.error || 'Loan not found'), { statusCode: 404 });
        res.json({ success: true, data: result.loan });
    }
    catch (err) {
        next(err);
    }
}
async function createLoan(req, res, next) {
    try {
        const result = await adapter_1.db.createLoanWithSchedule(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('CREATE_LOAN', 'loan', result.loanId, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updateLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.addLoan({ ...req.body, id });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('UPDATE_LOAN', 'loan', id, null, JSON.stringify(req.body));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteClient(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_LOAN', 'loan', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getLoanInstallments(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getLoanInstallments(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.installments });
    }
    catch (err) {
        next(err);
    }
}
async function getLoanPayments(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getPaymentsByLoan(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.payments });
    }
    catch (err) {
        next(err);
    }
}
async function getLoanSummary(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getLoanSummary(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.summary });
    }
    catch (err) {
        next(err);
    }
}
async function recalculateLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.recalculateLoanStatus(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function assessDefault(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.assessDefault(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getEarlySettlement(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.calculateEarlySettlement(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function earlySettle(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { discountPercent, notes } = req.body;
        const result = await adapter_1.db.earlySettleLoan(id, discountPercent || 0, notes || '');
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('EARLY_SETTLE', 'loan', id, null, JSON.stringify({ discountPercent }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getOverdueInstallments(req, res, next) {
    try {
        const result = await adapter_1.db.getOverdueInstallments();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.installments });
    }
    catch (err) {
        next(err);
    }
}
async function getUpcomingInstallments(req, res, next) {
    try {
        const days = parseInt(req.query.days || '30', 10);
        const result = await adapter_1.db.getUpcomingInstallments(days);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.installments });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=loans.controller.js.map