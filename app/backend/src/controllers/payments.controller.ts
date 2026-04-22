import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let payments = await db.getAllPayments();
    const { loanId, method, status } = req.query;
    if (loanId) payments = payments.filter((p: any) => p.loanId === parseInt(loanId as string, 10));
    if (method) payments = payments.filter((p: any) => p.paymentMethod === method || p.method === method);
    if (status) payments = payments.filter((p: any) => p.status === status);
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
}

export async function addPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.allocatePayment(req.body);
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Payment failed'), { statusCode: 400 });
    db.logAudit('ADD_PAYMENT', 'payment', result.paymentId || result.id, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function reversePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason, reversedBy } = req.body;
    const result = await db.reversePayment(id, reason || '', reversedBy || '');
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Reversal failed'), { statusCode: 400 });
    db.logAudit('REVERSE_PAYMENT', 'payment', id, null, JSON.stringify({ reason }));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getPaymentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getPaymentStats(req.query.period as string);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getPaymentPipeline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = parseInt((req.query.days as string) || '7', 10);
    const result = await db.getPaymentPipeline(days);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getProfitAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getProfitAnalysis(req.query.start as string, req.query.end as string);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getCollectionTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getCollectionTrends();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
