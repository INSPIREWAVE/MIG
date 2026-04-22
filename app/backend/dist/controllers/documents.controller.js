"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClientDocuments = listClientDocuments;
exports.uploadClientDocument = uploadClientDocument;
exports.deleteClientDocument = deleteClientDocument;
exports.listCompanyDocuments = listCompanyDocuments;
exports.uploadCompanyDocument = uploadCompanyDocument;
exports.deleteCompanyDocument = deleteCompanyDocument;
exports.downloadDocument = downloadDocument;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const adapter_1 = require("../db/adapter");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path_1.default.join(process.cwd(), 'uploads');
async function listClientDocuments(req, res, next) {
    try {
        const clientId = parseInt(req.params.clientId, 10);
        const result = await adapter_1.db.getClientDocuments(clientId);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.documents });
    }
    catch (err) {
        next(err);
    }
}
async function uploadClientDocument(req, res, next) {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, error: 'No file uploaded' });
            return;
        }
        const { clientId, documentType, notes } = req.body;
        const result = await adapter_1.db.addClientDocument({
            clientId: parseInt(clientId, 10),
            documentType,
            filePath: req.file.path,
            fileName: req.file.originalname,
            notes: notes || '',
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('UPLOAD_CLIENT_DOC', 'document', result.id, null, JSON.stringify({ clientId, documentType }));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteClientDocument(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteClientDocument(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_CLIENT_DOC', 'document', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function listCompanyDocuments(_req, res, next) {
    try {
        const result = await adapter_1.db.getCompanyDocuments();
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        res.json({ success: true, data: result.documents });
    }
    catch (err) {
        next(err);
    }
}
async function uploadCompanyDocument(req, res, next) {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, error: 'No file uploaded' });
            return;
        }
        const { documentType, notes } = req.body;
        const result = await adapter_1.db.addCompanyDocument({
            documentType,
            filePath: req.file.path,
            fileName: req.file.originalname,
            notes: notes || '',
        });
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('UPLOAD_COMPANY_DOC', 'document', result.id, null, JSON.stringify({ documentType }));
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteCompanyDocument(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await adapter_1.db.deleteClientDocument(id);
        if (!result.success)
            throw Object.assign(new Error(result.error), { statusCode: 400 });
        adapter_1.db.logAudit('DELETE_COMPANY_DOC', 'document', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
function downloadDocument(req, res, next) {
    try {
        const { type, id } = req.params;
        if (!['client', 'company'].includes(type)) {
            res.status(400).json({ success: false, error: 'Invalid document type' });
            return;
        }
        const safeId = parseInt(id, 10);
        if (isNaN(safeId)) {
            res.status(400).json({ success: false, error: 'Invalid document id' });
            return;
        }
        const filePath = path_1.default.join(UPLOAD_DIR, type, String(safeId));
        if (!filePath.startsWith(UPLOAD_DIR)) {
            res.status(403).json({ success: false, error: 'Forbidden' });
            return;
        }
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ success: false, error: 'File not found' });
            return;
        }
        res.sendFile(filePath);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=documents.controller.js.map