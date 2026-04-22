"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAuditLog = listAuditLog;
exports.clearAuditLog = clearAuditLog;
exports.deleteAuditEntry = deleteAuditEntry;
const adapter_1 = require("../db/adapter");
async function listAuditLog(req, res, next) {
    try {
        const limit = parseInt(req.query.limit || '100', 10);
        const logs = await adapter_1.db.getAuditLog(limit);
        res.json({ success: true, data: logs });
    }
    catch (err) {
        next(err);
    }
}
async function clearAuditLog(_req, res, next) {
    try {
        const result = await adapter_1.db.clearAuditLog();
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteAuditEntry(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteAuditEntry(id);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=audit.controller.js.map