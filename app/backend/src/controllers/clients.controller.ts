import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let clients = await db.getClients();
    const { search, status, risk } = req.query;
    if (search) {
      const q = (search as string).toLowerCase();
      clients = clients.filter((c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.clientNumber?.toLowerCase().includes(q) ||
        c.nrc?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    if (status) clients = clients.filter((c: any) => c.clientStatus === status);
    if (risk) clients = clients.filter((c: any) => c.riskLevel === risk);
    res.json({ success: true, data: clients });
  } catch (err) { next(err); }
}

export async function getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const client = await db.getClientById(id);
    if (!client) throw Object.assign(new Error('Client not found'), { statusCode: 404 });
    const stats = await db.getClientStats(id);
    res.json({ success: true, data: { ...client, stats } });
  } catch (err) { next(err); }
}

export async function createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addClient(req.body);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Failed to create client'), { statusCode: 400 });
    db.logAudit('CREATE_CLIENT', 'client', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.updateClient(id, req.body);
    db.logAudit('UPDATE_CLIENT', 'client', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteClient(id);
    db.logAudit('DELETE_CLIENT', 'client', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getClientLoans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const loans = await db.getLoansByClient(id);
    res.json({ success: true, data: loans });
  } catch (err) { next(err); }
}

export async function getClientDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const docs = await db.getClientDocuments(id);
    res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}

export async function getClientActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const activity = await db.getClientActivity(id, limit);
    res.json({ success: true, data: activity });
  } catch (err) { next(err); }
}

export async function getClientStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const [stats, risk] = await Promise.all([
      db.getClientStats(id),
      db.calculateClientRisk(id),
    ]);
    res.json({ success: true, data: { ...stats, ...risk } });
  } catch (err) { next(err); }
}

export async function updateKycStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body;
    const result = await db.updateKycStatus(id, status, notes);
    db.logAudit('KYC_UPDATE', 'client', id, null, JSON.stringify({ status }));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function toggleBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { blacklisted, reason } = req.body;
    const result = await db.setClientBlacklist(id, !!blacklisted, reason || '');
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Blacklist update failed'), { statusCode: 400 });
    db.logAudit('BLACKLIST_TOGGLE', 'client', id, null, JSON.stringify({ blacklisted, reason }));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
