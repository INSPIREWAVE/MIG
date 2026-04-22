import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listLoans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, clientId, search } = req.query;
    const result = await db.getLoans({
      status: status as string,
      clientId: clientId ? parseInt(clientId as string, 10) : undefined,
      search: search as string,
    });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.loans });
  } catch (err) {
    next(err);
  }
}

export async function getLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getLoanDetails(id);
    if (!result.success) throw Object.assign(new Error(result.error || 'Loan not found'), { statusCode: 404 });
    res.json({ success: true, data: result.loan });
  } catch (err) {
    next(err);
  }
}

export async function createLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.createLoanWithSchedule(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('CREATE_LOAN', 'loan', result.loanId, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.addLoan({ ...req.body, id });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('UPDATE_LOAN', 'loan', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteClient(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('DELETE_LOAN', 'loan', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getLoanInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getLoanInstallments(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.installments });
  } catch (err) {
    next(err);
  }
}

export async function getLoanPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getPaymentsByLoan(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.payments });
  } catch (err) {
    next(err);
  }
}

export async function getLoanSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.getLoanSummary(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.summary });
  } catch (err) {
    next(err);
  }
}

export async function recalculateLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.recalculateLoanStatus(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function assessDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.assessDefault(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getEarlySettlement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.calculateEarlySettlement(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function earlySettle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { discountPercent, notes } = req.body;
    const result = await db.earlySettleLoan(id, discountPercent || 0, notes || '');
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('EARLY_SETTLE', 'loan', id, null, JSON.stringify({ discountPercent }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getOverdueInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getOverdueInstallments();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.installments });
  } catch (err) {
    next(err);
  }
}

export async function getUpcomingInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = parseInt((req.query.days as string) || '30', 10);
    const result = await db.getUpcomingInstallments(days);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.installments });
  } catch (err) {
    next(err);
  }
}
