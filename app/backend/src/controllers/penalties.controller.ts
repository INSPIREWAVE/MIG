import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listPenalties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const penalties = await db.getAllPenalties();
    res.json({ success: true, data: penalties });
  } catch (err) { next(err); }
}

export async function addPenalty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addPenalty(req.body);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Failed to add penalty'), { statusCode: 400 });
    db.logAudit('ADD_PENALTY', 'penalty', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updatePenaltyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const result = await db.updatePenaltyStatus(id, status);
    db.logAudit('UPDATE_PENALTY_STATUS', 'penalty', id, null, JSON.stringify({ status }));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deletePenalty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deletePenalty(id);
    db.logAudit('DELETE_PENALTY', 'penalty', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function applyAutoPenalties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.applyAutoPenalties();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
