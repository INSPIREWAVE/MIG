"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPenalties = listPenalties;
exports.addPenalty = addPenalty;
exports.updatePenaltyStatus = updatePenaltyStatus;
exports.deletePenalty = deletePenalty;
exports.applyAutoPenalties = applyAutoPenalties;
const adapter_1 = require("../db/adapter");
async function listPenalties(req, res, next) {
    try {
        const result = await adapter_1.db.getAllPenalties();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.penalties });
    }
    catch (err) {
        next(err);
    }
}
async function addPenalty(req, res, next) {
    try {
        const result = await adapter_1.db.addPenalty(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('ADD_PENALTY', 'penalty', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updatePenaltyStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;
        const result = await adapter_1.db.updatePenaltyStatus(id, status);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('UPDATE_PENALTY_STATUS', 'penalty', id, null, JSON.stringify({ status }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deletePenalty(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deletePenalty(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_PENALTY', 'penalty', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function applyAutoPenalties(req, res, next) {
    try {
        const result = await adapter_1.db.applyAutoPenalties();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=penalties.controller.js.map