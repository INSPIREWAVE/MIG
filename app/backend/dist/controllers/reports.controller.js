"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
exports.getPaymentChart = getPaymentChart;
exports.getDailyCollection = getDailyCollection;
exports.getProfitReport = getProfitReport;
exports.getFinancialAdvisory = getFinancialAdvisory;
exports.runBatchAssessment = runBatchAssessment;
const adapter_1 = require("../db/adapter");
async function getDashboard(_req, res, next) {
    try {
        const [clients, loans, payments, overdue] = await Promise.all([
            adapter_1.db.getClients({}),
            adapter_1.db.getLoans({}),
            adapter_1.db.getAllPayments({}),
            adapter_1.db.getOverdueInstallments(),
        ]);
        const allLoans = loans.loans || [];
        const activeLoans = allLoans.filter((l) => l['status'] === 'active');
        const portfolioValue = activeLoans.reduce((sum, l) => sum + (l['amount'] || 0), 0);
        const totalPaid = (payments.payments || []).reduce((sum, p) => sum + (p['amount'] || 0), 0);
        const totalExpected = allLoans.reduce((sum, l) => sum + (l['totalPayable'] || l['amount'] || 0), 0);
        const collectionRate = totalExpected > 0 ? Math.min((totalPaid / totalExpected) * 100, 100) : 0;
        const defaultedLoans = allLoans.filter((l) => l['status'] === 'defaulted');
        const defaultRate = allLoans.length > 0 ? (defaultedLoans.length / allLoans.length) * 100 : 0;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const monthlyPayments = (payments.payments || []).filter((p) => p['paymentDate'] >= monthStart);
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p['amount'] || 0), 0);
        const kpi = {
            totalClients: (clients.clients || []).length,
            activeLoans: activeLoans.length,
            portfolioValue,
            collectionRate: Math.round(collectionRate * 100) / 100,
            defaultRate: Math.round(defaultRate * 100) / 100,
            monthlyRevenue,
            overdueCount: (overdue.installments || []).length,
            totalCollateral: 0,
        };
        res.json({ success: true, data: kpi });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentChart(req, res, next) {
    try {
        const { period, groupBy } = req.query;
        const result = await adapter_1.db.getPaymentChartData(period, groupBy);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getDailyCollection(req, res, next) {
    try {
        const { date } = req.query;
        const result = await adapter_1.db.getDailyCollectionReport(date);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getProfitReport(req, res, next) {
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
async function getFinancialAdvisory(_req, res, next) {
    try {
        const [loans, payments, overdue] = await Promise.all([
            adapter_1.db.getLoans({}),
            adapter_1.db.getPaymentStats('monthly'),
            adapter_1.db.getOverdueInstallments(),
        ]);
        res.json({
            success: true,
            data: {
                loanPortfolio: loans.loans,
                paymentStats: payments.stats,
                overdueInstallments: overdue.installments,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
async function runBatchAssessment(_req, res, next) {
    try {
        const result = await adapter_1.db.runBatchAssessment();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=reports.controller.js.map