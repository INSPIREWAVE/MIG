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
        let loans = await adapter_1.db.getLoans();
        const { status, clientId, search } = req.query;
        if (status)
            loans = loans.filter((l) => l.status === status);
        if (clientId)
            loans = loans.filter((l) => l.clientId === parseInt(clientId, 10));
        if (search) {
            const q = search.toLowerCase();
            loans = loans.filter((l) => l.loanNumber?.toLowerCase().includes(q) || l.clientName?.toLowerCase().includes(q));
        }
        res.json({ success: true, data: loans });
    }
    catch (err) {
        next(err);
    }
}
async function getLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const loan = await adapter_1.db.getLoanDetails(id);
        if (!loan)
            throw Object.assign(new Error('Loan not found'), { statusCode: 404 });
        res.json({ success: true, data: loan });
    }
    catch (err) {
        next(err);
    }
}
async function createLoan(req, res, next) {
    try {
        const result = await adapter_1.db.createLoanWithSchedule(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to create loan'), { statusCode: 400 });
        adapter_1.db.logAudit('CREATE_LOAN', 'loan', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updateLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.updateLoan(id, req.body);
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
        const result = await adapter_1.db.deleteLoan(id);
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
        const installments = await adapter_1.db.getLoanInstallments(id);
        res.json({ success: true, data: installments });
    }
    catch (err) {
        next(err);
    }
}
async function getLoanPayments(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const payments = await adapter_1.db.getPaymentsByLoan(id);
        res.json({ success: true, data: payments });
    }
    catch (err) {
        next(err);
    }
}
async function getLoanSummary(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const summary = await adapter_1.db.getLoanSummary(id);
        if (!summary)
            throw Object.assign(new Error('Loan not found'), { statusCode: 404 });
        res.json({ success: true, data: summary });
    }
    catch (err) {
        next(err);
    }
}
async function recalculateLoan(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.recalculateLoanStatus(id);
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
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Cannot calculate settlement'), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function earlySettle(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.earlySettleLoan(id, req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Settlement failed'), { statusCode: 400 });
        adapter_1.db.logAudit('EARLY_SETTLE', 'loan', id, null, JSON.stringify(req.body));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getOverdueInstallments(req, res, next) {
    try {
        const installments = await adapter_1.db.getOverdueInstallments();
        res.json({ success: true, data: installments });
    }
    catch (err) {
        next(err);
    }
}
async function getUpcomingInstallments(req, res, next) {
    try {
        const days = parseInt(req.query.days || '7', 10);
        const installments = await adapter_1.db.getUpcomingInstallments(days);
        res.json({ success: true, data: installments });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=loans.controller.js.map