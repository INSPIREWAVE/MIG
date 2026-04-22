import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getAccounts();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.accounts });
  } catch (err) {
    next(err);
  }
}

export async function createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addAccount(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('CREATE_ACCOUNT', 'account', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.updateAccount(id, req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteAccount(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('DELETE_ACCOUNT', 'account', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function listTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId, startDate, endDate } = req.query;
    const result = await db.getTransactions({
      accountId: accountId ? parseInt(accountId as string, 10) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.transactions });
  } catch (err) {
    next(err);
  }
}

export async function addTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addTransaction(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('ADD_TRANSACTION', 'transaction', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function listBalanceSheets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getBalanceSheets();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.sheets });
  } catch (err) {
    next(err);
  }
}

export async function generateBalanceSheet(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period } = req.body;
    const result = await db.generateBalanceSheet(period);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
