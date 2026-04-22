"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCollateral = listCollateral;
exports.getCollateralByLoan = getCollateralByLoan;
exports.getCollateralByClient = getCollateralByClient;
exports.addCollateral = addCollateral;
exports.updateCollateral = updateCollateral;
exports.deleteCollateral = deleteCollateral;
exports.forfeitCollateral = forfeitCollateral;
const adapter_1 = require("../db/adapter");
async function listCollateral(req, res, next) {
    try {
        const collateral = await adapter_1.db.getAllCollateral();
        res.json({ success: true, data: collateral });
    }
    catch (err) {
        next(err);
    }
}
async function getCollateralByLoan(req, res, next) {
    try {
        const loanId = parseInt(req.params.loanId, 10);
        const collateral = await adapter_1.db.getCollateralByLoan(loanId);
        res.json({ success: true, data: collateral });
    }
    catch (err) {
        next(err);
    }
}
async function getCollateralByClient(req, res, next) {
    try {
        const clientId = parseInt(req.params.clientId, 10);
        const collateral = await adapter_1.db.getCollateralByClient(clientId);
        res.json({ success: true, data: collateral });
    }
    catch (err) {
        next(err);
    }
}
async function addCollateral(req, res, next) {
    try {
        const result = await adapter_1.db.addCollateral(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to add collateral'), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_COLLATERAL', 'collateral', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updateCollateral(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.updateCollateral(id, req.body);
        adapter_1.db.logAudit('UPDATE_COLLATERAL', 'collateral', id, null, JSON.stringify(req.body));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteCollateral(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteCollateral(id);
        adapter_1.db.logAudit('DELETE_COLLATERAL', 'collateral', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function forfeitCollateral(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.forfeitCollateral(id);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Forfeit failed'), { statusCode: 400 });
        adapter_1.db.logAudit('FORFEIT_COLLATERAL', 'collateral', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=collateral.controller.js.map