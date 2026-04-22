import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [clients, loans, payments, overdue] = await Promise.all([
      db.getClients({}),
      db.getLoans({}),
      db.getAllPayments({}),
      db.getOverdueInstallments(),
    ]);

    const allLoans: Record<string, unknown>[] = (loans.loans as Record<string, unknown>[]) || [];
    const activeLoans = allLoans.filter((l) => l['status'] === 'active');
    const portfolioValue = activeLoans.reduce((sum, l) => sum + ((l['amount'] as number) || 0), 0);
    const totalPaid = ((payments.payments as Record<string, unknown>[]) || []).reduce(
      (sum, p) => sum + ((p['amount'] as number) || 0),
      0,
    );
    const totalExpected = allLoans.reduce((sum, l) => sum + ((l['totalPayable'] as number) || (l['amount'] as number) || 0), 0);
    const collectionRate = totalExpected > 0 ? Math.min((totalPaid / totalExpected) * 100, 100) : 0;
    const defaultedLoans = allLoans.filter((l) => l['status'] === 'defaulted');
    const defaultRate = allLoans.length > 0 ? (defaultedLoans.length / allLoans.length) * 100 : 0;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const monthlyPayments = ((payments.payments as Record<string, unknown>[]) || []).filter(
      (p) => (p['paymentDate'] as string) >= monthStart,
    );
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + ((p['amount'] as number) || 0), 0);

    const kpi = {
      totalClients: ((clients.clients as unknown[]) || []).length,
      activeLoans: activeLoans.length,
      portfolioValue,
      collectionRate: Math.round(collectionRate * 100) / 100,
      defaultRate: Math.round(defaultRate * 100) / 100,
      monthlyRevenue,
      overdueCount: ((overdue.installments as unknown[]) || []).length,
      totalCollateral: 0,
    };

    res.json({ success: true, data: kpi });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period, groupBy } = req.query;
    const result = await db.getPaymentChartData(period as string, groupBy as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getDailyCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.query;
    const result = await db.getDailyCollectionReport(date as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getProfitReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await db.getProfitAnalysis(startDate as string, endDate as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getFinancialAdvisory(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [loans, payments, overdue] = await Promise.all([
      db.getLoans({}),
      db.getPaymentStats('monthly'),
      db.getOverdueInstallments(),
    ]);
    res.json({
      success: true,
      data: {
        loanPortfolio: loans.loans,
        paymentStats: payments.stats,
        overdueInstallments: overdue.installments,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function runBatchAssessment(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.runBatchAssessment();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
