import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { loanId, startDate, endDate, method, status } = req.query;
    const result = await db.getAllPayments({
      loanId: loanId ? parseInt(loanId as string, 10) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      method: method as string,
      status: status as string,
    });
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.payments });
  } catch (err) {
    next(err);
  }
}

export async function addPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.addPaymentEnhanced(req.body);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('ADD_PAYMENT', 'payment', result.paymentId, null, JSON.stringify(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function reversePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;
    const result = await db.reversePayment(id, reason || '');
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('REVERSE_PAYMENT', 'payment', id, null, JSON.stringify({ reason }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period } = req.query;
    const result = await db.getPaymentStats(period as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.stats });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentPipeline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getPaymentPipeline();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.pipeline });
  } catch (err) {
    next(err);
  }
}

export async function getProfitAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await db.getProfitAnalysis(startDate as string, endDate as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getCollectionTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { months } = req.query;
    const result = await db.getCollectionTrends(months ? parseInt(months as string, 10) : 6);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
