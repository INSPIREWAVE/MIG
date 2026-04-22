import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listLoans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let loans = await db.getLoans();
    const { status, clientId, search } = req.query;
    if (status) loans = loans.filter((l: any) => l.status === status);
    if (clientId) loans = loans.filter((l: any) => l.clientId === parseInt(clientId as string, 10));
    if (search) {
      const q = (search as string).toLowerCase();
      loans = loans.filter((l: any) =>
        l.loanNumber?.toLowerCase().includes(q) || l.clientName?.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, data: loans });
  } catch (err) { next(err); }
}

export async function getLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const loan = await db.getLoanDetails(id);
    if (!loan) throw Object.assign(new Error('Loan not found'), { statusCode: 404 });
    res.json({ success: true, data: loan });
  } catch (err) { next(err); }
}

export async function createLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.createLoanWithSchedule(req.body);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Failed to create loan'), { statusCode: 400 });
    db.logAudit('CREATE_LOAN', 'loan', result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.updateLoan(id, req.body);
    db.logAudit('UPDATE_LOAN', 'loan', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.deleteLoan(id);
    db.logAudit('DELETE_LOAN', 'loan', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getLoanInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const installments = await db.getLoanInstallments(id);
    res.json({ success: true, data: installments });
  } catch (err) { next(err); }
}

export async function getLoanPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const payments = await db.getPaymentsByLoan(id);
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
}

export async function getLoanSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const summary = await db.getLoanSummary(id);
    if (!summary) throw Object.assign(new Error('Loan not found'), { statusCode: 404 });
    res.json({ success: true, data: summary });
  } catch (err) { next(err); }
}

export async function recalculateLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.recalculateLoanStatus(id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function assessDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.assessDefault(id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getEarlySettlement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.calculateEarlySettlement(id);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Cannot calculate settlement'), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function earlySettle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.earlySettleLoan(id, req.body);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Settlement failed'), { statusCode: 400 });
    db.logAudit('EARLY_SETTLE', 'loan', id, null, JSON.stringify(req.body));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getOverdueInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const installments = await db.getOverdueInstallments();
    res.json({ success: true, data: installments });
  } catch (err) { next(err); }
}

export async function getUpcomingInstallments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = parseInt((req.query.days as string) || '7', 10);
    const installments = await db.getUpcomingInstallments(days);
    res.json({ success: true, data: installments });
  } catch (err) { next(err); }
}
