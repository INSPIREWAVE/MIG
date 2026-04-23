import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../db/adapter';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

export async function listClientDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientId = parseInt(req.params.clientId, 10);
    const docs = await db.getClientDocuments(clientId);
    res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}

export async function uploadClientDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    const { documentType, notes } = req.body;
    const rawClientId = req.params.clientId ?? req.body.clientId;
    const clientId = parseInt(String(rawClientId ?? ''), 10);
    if (isNaN(clientId)) {
      res.status(400).json({ success: false, error: 'Valid clientId is required' });
      return;
    }
    const result = await db.addClientDocument({
      clientId,
      documentType,
      filePath: req.file.path,
      fileName: req.file.originalname,
      notes: notes || '',
    });
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Upload failed'), { statusCode: 400 });
    db.logAudit('UPLOAD_CLIENT_DOC', 'document', result.id, null, JSON.stringify({ clientId, documentType }));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteClientDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteClientDocument(id);
    db.logAudit('DELETE_CLIENT_DOC', 'document', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function listCompanyDocuments(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const docs = await db.getCompanyDocuments();
    res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}

export async function uploadCompanyDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    const { documentType, notes } = req.body;
    const result = await db.addCompanyDocument({
      documentType,
      filePath: req.file.path,
      fileName: req.file.originalname,
      notes: notes || '',
    });
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Upload failed'), { statusCode: 400 });
    db.logAudit('UPLOAD_COMPANY_DOC', 'document', result.id, null, JSON.stringify({ documentType }));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteCompanyDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteCompanyDocument(id);
    db.logAudit('DELETE_COMPANY_DOC', 'document', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export function downloadDocument(req: Request, res: Response, next: NextFunction): void {
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
    const filePath = path.join(UPLOAD_DIR, type, String(safeId));
    if (!filePath.startsWith(UPLOAD_DIR)) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, error: 'File not found' });
      return;
    }
    res.sendFile(filePath);
  } catch (err) { next(err); }
}
