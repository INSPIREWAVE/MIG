import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listBackups(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const backups = await db.getBackups();
    res.json({ success: true, data: backups });
  } catch (err) { next(err); }
}

export async function createBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type } = req.body;
    const result = await db.createBackup(type || 'manual');
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Backup failed'), { statusCode: 400 });
    db.logAudit('CREATE_BACKUP', 'backup', result.id, null, null);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function restoreBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.restoreBackup(id);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Restore failed'), { statusCode: 400 });
    db.logAudit('RESTORE_BACKUP', 'backup', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteBackup(id);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Delete failed'), { statusCode: 400 });
    db.logAudit('DELETE_BACKUP', 'backup', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
