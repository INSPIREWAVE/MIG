import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const { entityType, entityId } = req.query;
    const result = await db.getAuditLog({
      limit,
      entityType: entityType as string,
      entityId: entityId ? parseInt(entityId as string, 10) : undefined,
    });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.logs });
  } catch (err) {
    next(err);
  }
}

export async function clearAuditLog(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.clearAuditLog();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
