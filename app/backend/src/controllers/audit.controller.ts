import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const logs = await db.getAuditLog(limit);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
}

export async function clearAuditLog(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.clearAuditLog();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteAuditEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteAuditEntry(id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
