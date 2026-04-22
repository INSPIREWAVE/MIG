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
        const [loans, clients, payments, collateral, overdueInstallments] = await Promise.all([
            adapter_1.db.getLoans(),
            adapter_1.db.getClients(),
            adapter_1.db.getAllPayments(),
            adapter_1.db.getAllCollateral(),
            adapter_1.db.getOverdueInstallments(),
        ]);
        const activeLoans = loans.filter((l) => l.status === 'active' || l.status === 'pending' || l.status === 'overdue');
        const defaultedLoans = loans.filter((l) => l.status === 'defaulted');
        const portfolioValue = activeLoans.reduce((sum, l) => sum + (l.remainingBalance || l.balance || l.amount || 0), 0);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const monthPayments = payments.filter((p) => (p.paymentDate || p.createdAt || '') >= monthStart);
        const monthlyRevenue = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalCollateral = collateral
            .filter((c) => c.status === 'active')
            .reduce((sum, c) => sum + (c.acceptedValue || c.estimatedValue || 0), 0);
        const kpis = {
            totalClients: clients.length,
            activeLoans: activeLoans.length,
            portfolioValue,
            collectionRate: loans.length > 0 ? Math.round(((loans.length - defaultedLoans.length) / loans.length) * 100) : 100,
            defaultRate: loans.length > 0 ? Math.round((defaultedLoans.length / loans.length) * 100) : 0,
            monthlyRevenue,
            overdueCount: overdueInstallments.length,
            totalCollateral,
            totalLoans: loans.length,
            totalCleared: loans.filter((l) => l.status === 'paid' || l.status === 'cleared').length,
        };
        res.json({ success: true, data: kpis });
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentChart(req, res, next) {
    try {
        const { period, groupBy } = req.query;
        const result = await adapter_1.db.getPaymentChartData(period, groupBy);
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
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getFinancialAdvisory(_req, res, next) {
    try {
        const [loans, paymentStats, overdue] = await Promise.all([
            adapter_1.db.getLoans(),
            adapter_1.db.getPaymentStats('monthly'),
            adapter_1.db.getOverdueInstallments(),
        ]);
        res.json({
            success: true,
            data: { loanPortfolio: loans, paymentStats, overdueInstallments: overdue },
        });
    }
    catch (err) {
        next(err);
    }
}
async function runBatchAssessment(_req, res, next) {
    try {
        const result = await adapter_1.db.runBatchAssessment();
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Batch assessment failed'), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=reports.controller.js.map