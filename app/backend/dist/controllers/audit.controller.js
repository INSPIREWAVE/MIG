"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAuditLog = listAuditLog;
exports.clearAuditLog = clearAuditLog;
const adapter_1 = require("../db/adapter");
async function listAuditLog(req, res, next) {
    try {
        const limit = parseInt(req.query.limit || '100', 10);
        const { entityType, entityId } = req.query;
        const result = await adapter_1.db.getAuditLog({
            limit,
            entityType: entityType,
            entityId: entityId ? parseInt(entityId, 10) : undefined,
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.logs });
    }
    catch (err) {
        next(err);
    }
}
async function clearAuditLog(_req, res, next) {
    try {
        const result = await adapter_1.db.clearAuditLog();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=audit.controller.js.map