"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccounts = listAccounts;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
exports.listTransactions = listTransactions;
exports.addTransaction = addTransaction;
exports.listBalanceSheets = listBalanceSheets;
exports.generateBalanceSheet = generateBalanceSheet;
const adapter_1 = require("../db/adapter");
async function listAccounts(req, res, next) {
    try {
        const result = await adapter_1.db.getAccounts();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.accounts });
    }
    catch (err) {
        next(err);
    }
}
async function createAccount(req, res, next) {
    try {
        const result = await adapter_1.db.addAccount(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('CREATE_ACCOUNT', 'account', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updateAccount(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.updateAccount(id, req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteAccount(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteAccount(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_ACCOUNT', 'account', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function listTransactions(req, res, next) {
    try {
        const { accountId, startDate, endDate } = req.query;
        const result = await adapter_1.db.getTransactions({
            accountId: accountId ? parseInt(accountId, 10) : undefined,
            startDate: startDate,
            endDate: endDate,
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.transactions });
    }
    catch (err) {
        next(err);
    }
}
async function addTransaction(req, res, next) {
    try {
        const result = await adapter_1.db.addTransaction(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_TRANSACTION', 'transaction', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function listBalanceSheets(req, res, next) {
    try {
        const result = await adapter_1.db.getBalanceSheets();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.sheets });
    }
    catch (err) {
        next(err);
    }
}
async function generateBalanceSheet(req, res, next) {
    try {
        const { period } = req.body;
        const result = await adapter_1.db.generateBalanceSheet(period);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=accounts.controller.js.map