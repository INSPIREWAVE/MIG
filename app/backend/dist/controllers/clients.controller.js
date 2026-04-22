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
        let clients = await adapter_1.db.getClients();
        const { search, status, risk } = req.query;
        if (search) {
            const q = search.toLowerCase();
            clients = clients.filter((c) => c.name?.toLowerCase().includes(q) ||
                c.phone?.toLowerCase().includes(q) ||
                c.clientNumber?.toLowerCase().includes(q) ||
                c.nrc?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q));
        }
        if (status)
            clients = clients.filter((c) => c.clientStatus === status);
        if (risk)
            clients = clients.filter((c) => c.riskLevel === risk);
        res.json({ success: true, data: clients });
    }
    catch (err) {
        next(err);
    }
}
async function getClient(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const client = await adapter_1.db.getClientById(id);
        if (!client)
            throw Object.assign(new Error('Client not found'), { statusCode: 404 });
        const stats = await adapter_1.db.getClientStats(id);
        res.json({ success: true, data: { ...client, stats } });
    }
    catch (err) {
        next(err);
    }
}
async function createClient(req, res, next) {
    try {
        const result = await adapter_1.db.addClient(req.body);
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Failed to create client'), { statusCode: 400 });
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
        const loans = await adapter_1.db.getLoansByClient(id);
        res.json({ success: true, data: loans });
    }
    catch (err) {
        next(err);
    }
}
async function getClientDocuments(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const docs = await adapter_1.db.getClientDocuments(id);
        res.json({ success: true, data: docs });
    }
    catch (err) {
        next(err);
    }
}
async function getClientActivity(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const limit = parseInt(req.query.limit || '50', 10);
        const activity = await adapter_1.db.getClientActivity(id, limit);
        res.json({ success: true, data: activity });
    }
    catch (err) {
        next(err);
    }
}
async function getClientStats(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const [stats, risk] = await Promise.all([
            adapter_1.db.getClientStats(id),
            adapter_1.db.calculateClientRisk(id),
        ]);
        res.json({ success: true, data: { ...stats, ...risk } });
    }
    catch (err) {
        next(err);
    }
}
async function updateKycStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { status, notes } = req.body;
        const result = await adapter_1.db.updateKycStatus(id, status, notes);
        adapter_1.db.logAudit('KYC_UPDATE', 'client', id, null, JSON.stringify({ status }));
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
        const result = await adapter_1.db.setClientBlacklist(id, !!blacklisted, reason || '');
        if (result && result.success === false)
            throw Object.assign(new Error(result.error || 'Blacklist update failed'), { statusCode: 400 });
        adapter_1.db.logAudit('BLACKLIST_TOGGLE', 'client', id, null, JSON.stringify({ blacklisted, reason }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=clients.controller.js.map