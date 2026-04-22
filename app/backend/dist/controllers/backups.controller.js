"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBackups = listBackups;
exports.createBackup = createBackup;
exports.restoreBackup = restoreBackup;
exports.deleteBackup = deleteBackup;
const adapter_1 = require("../db/adapter");
async function listBackups(_req, res, next) {
    try {
        const backups = await adapter_1.db.getBackups();
        res.json({ success: true, data: backups });
    }
    catch (err) {
        next(err);
    }
}
async function createBackup(req, res, next) {
    try {
        const { type } = req.body;
        const result = await adapter_1.db.createBackup(type || 'manual');
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Backup failed'), { statusCode: 400 });
        adapter_1.db.logAudit('CREATE_BACKUP', 'backup', result.id, null, null);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function restoreBackup(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.restoreBackup(id);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Restore failed'), { statusCode: 400 });
        adapter_1.db.logAudit('RESTORE_BACKUP', 'backup', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteBackup(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteBackup(id);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Delete failed'), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_BACKUP', 'backup', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=backups.controller.js.map