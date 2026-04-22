"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetting = getSetting;
exports.setSetting = setSetting;
const adapter_1 = require("../db/adapter");
async function getSetting(req, res, next) {
    try {
        const { key } = req.params;
        const value = await adapter_1.db.getSetting(key);
        res.json({ success: true, data: { key, value } });
    }
    catch (err) {
        next(err);
    }
}
async function setSetting(req, res, next) {
    try {
        const { key, value } = req.body;
        if (!key) {
            res.status(400).json({ success: false, error: 'Key is required' });
            return;
        }
        await adapter_1.db.setSetting(key, value);
        res.json({ success: true, data: { key, value } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=settings.controller.js.map