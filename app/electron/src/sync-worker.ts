/**
 * Sync Worker
 * Pushes offline queue items to the online server, pulls server delta.
 */

interface SyncQueueItem {
  id: string;
  entityType: string;
  operation: string;
  payload: Record<string, unknown>;
  clientTimestamp: string;
  retries: number;
}

interface SyncResult {
  pushed: number;
  failed: number;
  errors: string[];
}

const MAX_RETRIES = 3;

export async function pushSyncQueue(
  items: SyncQueueItem[],
  serverUrl: string,
  accessToken: string
): Promise<SyncResult> {
  const result: SyncResult = { pushed: 0, failed: 0, errors: [] };

  for (const item of items) {
    if (item.retries >= MAX_RETRIES) {
      result.failed++;
      result.errors.push(`Item ${item.id} exceeded max retries`);
      continue;
    }
    try {
      const response = await fetch(`${serverUrl}/api/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ items: [item] }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${response.status}`);
      }
      result.pushed++;
    } catch (err: unknown) {
      item.retries++;
      result.failed++;
      result.errors.push(
        `Item ${item.id}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return result;
}

export async function pullServerDelta(
  serverUrl: string,
  accessToken: string,
  lastSyncAt: string
): Promise<Record<string, unknown[]>> {
  const response = await fetch(
    `${serverUrl}/api/sync/pull?lastSyncAt=${encodeURIComponent(lastSyncAt)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!response.ok) {
    throw new Error(`Pull failed: HTTP ${response.status}`);
  }
  return response.json() as Promise<Record<string, unknown[]>>;
}
