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
        const accounts = await adapter_1.db.getAccounts();
        res.json({ success: true, data: accounts });
    }
    catch (err) {
        next(err);
    }
}
async function createAccount(req, res, next) {
    try {
        const result = await adapter_1.db.addAccount(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to create account'), { statusCode: 400 });
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
        adapter_1.db.logAudit('DELETE_ACCOUNT', 'account', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function listTransactions(req, res, next) {
    try {
        const limit = parseInt(req.query.limit || '100', 10);
        const transactions = await adapter_1.db.getTransactions(limit);
        res.json({ success: true, data: transactions });
    }
    catch (err) {
        next(err);
    }
}
async function addTransaction(req, res, next) {
    try {
        const result = await adapter_1.db.addTransaction(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to add transaction'), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_TRANSACTION', 'transaction', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function listBalanceSheets(req, res, next) {
    try {
        const limit = parseInt(req.query.limit || '20', 10);
        const sheets = await adapter_1.db.getBalanceSheets(limit);
        res.json({ success: true, data: sheets });
    }
    catch (err) {
        next(err);
    }
}
async function generateBalanceSheet(req, res, next) {
    try {
        const { period } = req.body;
        const result = await adapter_1.db.generateBalanceSheet(period);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to generate balance sheet'), { statusCode: 400 });
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=accounts.controller.js.map