import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, status, risk } = req.query;
    const result = await db.getClients({
      search: search as string,
      status: status as string,
      risk: risk as string,
    });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.clients });
  } catch (err) {
    next(err);
  }
}

export async function getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const clientResult = await db.getClientById(id);
    if (!clientResult.success) throw Object.assign(new Error(clientResult.error || 'Client not found'), { statusCode: 404 });
    const statsResult = await db.getClientStats(id);
    res.json({ success: true, data: { ...clientResult.client, stats: statsResult.stats } });
  } catch (err) {
    next(err);
  }
}

export async function createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addClient(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('CREATE_CLIENT', 'client', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.updateClient(id, req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('UPDATE_CLIENT', 'client', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteClient(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('DELETE_CLIENT', 'client', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getClientLoans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getLoansByClient(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.loans });
  } catch (err) {
    next(err);
  }
}

export async function getClientDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getClientDocuments(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.documents });
  } catch (err) {
    next(err);
  }
}

export async function getClientActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getAuditLog({ entityType: 'client', entityId: id, limit: 50 });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.logs });
  } catch (err) {
    next(err);
  }
}

export async function getClientStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const [statsResult, riskResult] = await Promise.all([
      db.getClientStats(id),
      db.calculateClientRisk(id),
    ]);
    res.json({ success: true, data: { stats: statsResult.stats, risk: riskResult.risk } });
  } catch (err) {
    next(err);
  }
}

export async function updateKycStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { kycStatus } = req.body;
    const result = await db.updateClient(id, { kycStatus });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('KYC_UPDATE', 'client', id, null, JSON.stringify({ kycStatus }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function toggleBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { blacklisted, reason } = req.body;
    const result = await db.updateClient(id, { blacklisted: blacklisted ? 1 : 0, notes: reason });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('BLACKLIST_TOGGLE', 'client', id, null, JSON.stringify({ blacklisted, reason }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
