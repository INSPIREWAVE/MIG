import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [loans, clients, payments, collateral, overdueInstallments] = await Promise.all([
      db.getLoans(),
      db.getClients(),
      db.getAllPayments(),
      db.getAllCollateral(),
      db.getOverdueInstallments(),
    ]);

    const activeLoans = loans.filter((l: any) => l.status === 'active' || l.status === 'pending' || l.status === 'overdue');
    const defaultedLoans = loans.filter((l: any) => l.status === 'defaulted');
    const portfolioValue = activeLoans.reduce((sum: number, l: any) => sum + (l.remainingBalance || l.balance || l.amount || 0), 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const monthPayments = payments.filter((p: any) => (p.paymentDate || p.createdAt || '') >= monthStart);
    const monthlyRevenue = monthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    const totalCollateral = collateral
      .filter((c: any) => c.status === 'active')
      .reduce((sum: number, c: any) => sum + (c.acceptedValue || c.estimatedValue || 0), 0);

    const kpis = {
      totalClients: clients.length,
      activeLoans: activeLoans.length,
      portfolioValue,
      collectionRate: loans.length > 0 ? Math.round(((loans.length - defaultedLoans.length) / loans.length) * 100) : 100,
      defaultRate: loans.length > 0 ? Math.round((defaultedLoans.length / loans.length) * 100) : 0,
      monthlyRevenue,
      overdueCount: overdueInstallments.length,
      totalCollateral,
      totalLoans: loans.length,
      totalCleared: loans.filter((l: any) => l.status === 'paid' || l.status === 'cleared').length,
    };

    res.json({ success: true, data: kpis });
  } catch (err) { next(err); }
}

export async function getPaymentChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period, groupBy } = req.query;
    const result = await db.getPaymentChartData(period as string, groupBy as string);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getDailyCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.query;
    const result = await db.getDailyCollectionReport(date as string);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getProfitReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    const result = await db.getProfitAnalysis(startDate as string, endDate as string);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getFinancialAdvisory(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [loans, paymentStats, overdue] = await Promise.all([
      db.getLoans(),
      db.getPaymentStats('monthly'),
      db.getOverdueInstallments(),
    ]);
    res.json({
      success: true,
      data: { loanPortfolio: loans, paymentStats, overdueInstallments: overdue },
    });
  } catch (err) { next(err); }
}

export async function runBatchAssessment(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.runBatchAssessment();
    if (result && result.success === false) throw Object.assign(new Error(result.error || 'Batch assessment failed'), { statusCode: 400 });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
