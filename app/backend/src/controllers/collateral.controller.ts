import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getAllCollateral();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.collateral });
  } catch (err) {
    next(err);
  }
}

export async function getCollateralByLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const loanId = parseInt(req.params.loanId, 10);
    const result = await db.getCollateralByLoan(loanId);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.collateral });
  } catch (err) {
    next(err);
  }
}

export async function getCollateralByClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clientId = parseInt(req.params.clientId, 10);
    const result = await db.getCollateralByClient(clientId);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.collateral });
  } catch (err) {
    next(err);
  }
}

export async function addCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addCollateral(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('ADD_COLLATERAL', 'collateral', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.updateCollateral(id, req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('UPDATE_COLLATERAL', 'collateral', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteCollateral(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('DELETE_COLLATERAL', 'collateral', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function forfeitCollateral(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;
    const result = await db.forfeitCollateral(id, reason || '');
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('FORFEIT_COLLATERAL', 'collateral', id, null, JSON.stringify({ reason }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
