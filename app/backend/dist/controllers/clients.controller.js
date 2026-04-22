"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClients = listClients;
exports.getClient = getClient;
exports.createClient = createClient;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.getClientLoans = getClientLoans;
exports.getClientDocuments = getClientDocuments;
exports.getClientActivity = getClientActivity;
exports.getClientStats = getClientStats;
exports.updateKycStatus = updateKycStatus;
exports.toggleBlacklist = toggleBlacklist;
const adapter_1 = require("../db/adapter");
async function listClients(req, res, next) {
    try {
        const { search, status, risk } = req.query;
        const result = await adapter_1.db.getClients({
            search: search,
            status: status,
            risk: risk,
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.clients });
    }
    catch (err) {
        next(err);
    }
}
async function getClient(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const clientResult = await adapter_1.db.getClientById(id);
        if (!clientResult.success)
            throw Object.assign(new Error(clientResult.error || 'Client not found'), { statusCode: 404 });
        const statsResult = await adapter_1.db.getClientStats(id);
        res.json({ success: true, data: { ...clientResult.client, stats: statsResult.stats } });
    }
    catch (err) {
        next(err);
    }
}
async function createClient(req, res, next) {
    try {
        const result = await adapter_1.db.addClient(req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('CREATE_CLIENT', 'client', result.id, null, JSON.stringify(req.body));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function updateClient(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.updateClient(id, req.body);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('UPDATE_CLIENT', 'client', id, null, JSON.stringify(req.body));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteClient(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteClient(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_CLIENT', 'client', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function getClientLoans(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getLoansByClient(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.loans });
    }
    catch (err) {
        next(err);
    }
}
async function getClientDocuments(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getClientDocuments(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.documents });
    }
    catch (err) {
        next(err);
    }
}
async function getClientActivity(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.getAuditLog({ entityType: 'client', entityId: id, limit: 50 });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.logs });
    }
    catch (err) {
        next(err);
    }
}
async function getClientStats(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const [statsResult, riskResult] = await Promise.all([
            adapter_1.db.getClientStats(id),
            adapter_1.db.calculateClientRisk(id),
        ]);
        res.json({ success: true, data: { stats: statsResult.stats, risk: riskResult.risk } });
    }
    catch (err) {
        next(err);
    }
}
async function updateKycStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { kycStatus } = req.body;
        const result = await adapter_1.db.updateClient(id, { kycStatus });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('KYC_UPDATE', 'client', id, null, JSON.stringify({ kycStatus }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function toggleBlacklist(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { blacklisted, reason } = req.body;
        const result = await adapter_1.db.updateClient(id, { blacklisted: blacklisted ? 1 : 0, notes: reason });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('BLACKLIST_TOGGLE', 'client', id, null, JSON.stringify({ blacklisted, reason }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=clients.controller.js.map