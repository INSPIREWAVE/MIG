import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

type EntityType = 'client' | 'loan' | 'payment' | 'collateral';
type Operation = 'create' | 'update' | 'delete';

interface SyncQueueItem {
  id: string;
  entityType: EntityType;
  operation: Operation;
  payload: Record<string, unknown>;
  clientTimestamp: string;
}

async function processItem(item: SyncQueueItem): Promise<{ id: string; success: boolean; error?: string }> {
  try {
    const { entityType, operation, payload } = item;

    if (entityType === 'client') {
      if (operation === 'create') {
        const r = await db.addClient(payload as Parameters<typeof db.addClient>[0]);
        return { id: item.id, success: r.success };
      } else if (operation === 'update' && payload['id']) {
        const r = await db.updateClient(Number(payload['id']), payload as Parameters<typeof db.updateClient>[1]);
        return { id: item.id, success: r.success };
      } else if (operation === 'delete' && payload['id']) {
        const r = await db.deleteClient(Number(payload['id']));
        return { id: item.id, success: r.success };
      }
    } else if (entityType === 'loan') {
      if (operation === 'create') {
        const r = await db.createLoanWithSchedule(payload as Parameters<typeof db.createLoanWithSchedule>[0]);
        return { id: item.id, success: r.success };
      }
    } else if (entityType === 'payment') {
      if (operation === 'create') {
        const r = await db.addPaymentEnhanced(payload as Parameters<typeof db.addPaymentEnhanced>[0]);
        return { id: item.id, success: r.success };
      }
    } else if (entityType === 'collateral') {
      if (operation === 'create') {
        const r = await db.addCollateral(payload as Parameters<typeof db.addCollateral>[0]);
        return { id: item.id, success: r.success };
      } else if (operation === 'update' && payload['id']) {
        const r = await db.updateCollateral(Number(payload['id']), payload as Parameters<typeof db.updateCollateral>[1]);
        return { id: item.id, success: r.success };
      } else if (operation === 'delete' && payload['id']) {
        const r = await db.deleteCollateral(Number(payload['id']));
        return { id: item.id, success: r.success };
      }
    }

    return { id: item.id, success: false, error: 'Unsupported entityType/operation combination' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { id: item.id, success: false, error: message };
  }
}

export function getStatus(_req: Request, res: Response): void {
  res.json({
    success: true,
    data: {
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '2.5.0',
    },
  });
}

export async function pushSync(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items: SyncQueueItem[] = req.body.items || [];
    if (!Array.isArray(items)) {
      res.status(400).json({ success: false, error: 'items must be an array' });
      return;
    }
    const results = await Promise.all(items.map(processItem));
    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    res.json({ success: true, data: { results, summary: { total: items.length, succeeded, failed } } });
  } catch (err) {
    next(err);
  }
}

export async function pullSync(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { lastSyncAt } = req.query;
    const result = await db.syncClientLoanData(lastSyncAt as string);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({
      success: true,
      data: {
        ...result,
        serverTimestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}
