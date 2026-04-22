"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = getStatus;
exports.pushSync = pushSync;
exports.pullSync = pullSync;
const adapter_1 = require("../db/adapter");
async function processItem(item) {
    try {
        const { entityType, operation, payload } = item;
        if (entityType === 'client') {
            if (operation === 'create') {
                const r = await adapter_1.db.addClient(payload);
                return { id: item.id, success: r.success };
            }
            else if (operation === 'update' && payload['id']) {
                const r = await adapter_1.db.updateClient(Number(payload['id']), payload);
                return { id: item.id, success: r.success };
            }
            else if (operation === 'delete' && payload['id']) {
                const r = await adapter_1.db.deleteClient(Number(payload['id']));
                return { id: item.id, success: r.success };
            }
        }
        else if (entityType === 'loan') {
            if (operation === 'create') {
                const r = await adapter_1.db.createLoanWithSchedule(payload);
                return { id: item.id, success: r.success };
            }
        }
        else if (entityType === 'payment') {
            if (operation === 'create') {
                const r = await adapter_1.db.addPaymentEnhanced(payload);
                return { id: item.id, success: r.success };
            }
        }
        else if (entityType === 'collateral') {
            if (operation === 'create') {
                const r = await adapter_1.db.addCollateral(payload);
                return { id: item.id, success: r.success };
            }
            else if (operation === 'update' && payload['id']) {
                const r = await adapter_1.db.updateCollateral(Number(payload['id']), payload);
                return { id: item.id, success: r.success };
            }
            else if (operation === 'delete' && payload['id']) {
                const r = await adapter_1.db.deleteCollateral(Number(payload['id']));
                return { id: item.id, success: r.success };
            }
        }
        return { id: item.id, success: false, error: 'Unsupported entityType/operation combination' };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { id: item.id, success: false, error: message };
    }
}
function getStatus(_req, res) {
    res.json({
        success: true,
        data: {
            status: 'online',
            timestamp: new Date().toISOString(),
            version: '2.5.0',
        },
    });
}
async function pushSync(req, res, next) {
    try {
        const items = req.body.items || [];
        if (!Array.isArray(items)) {
            res.status(400).json({ success: false, error: 'items must be an array' });
            return;
        }
        const results = await Promise.all(items.map(processItem));
        const succeeded = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        res.json({ success: true, data: { results, summary: { total: items.length, succeeded, failed } } });
    }
    catch (err) {
        next(err);
    }
}
async function pullSync(req, res, next) {
    try {
        const { lastSyncAt } = req.query;
        const result = await adapter_1.db.syncClientLoanData(lastSyncAt);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({
            success: true,
            data: {
                ...result,
                serverTimestamp: new Date().toISOString(),
            },
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=sync.controller.js.map