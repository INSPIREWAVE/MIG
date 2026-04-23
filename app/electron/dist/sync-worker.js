"use strict";
/**
 * Sync Worker
 * Pushes offline queue items to the online server, pulls server delta.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushSyncQueue = pushSyncQueue;
exports.pullServerDelta = pullServerDelta;
const MAX_RETRIES = 3;
async function pushSyncQueue(items, serverUrl, accessToken) {
    const result = { pushed: 0, failed: 0, errors: [] };
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
                const body = (await response.json().catch(() => ({})));
                throw new Error(body.error ?? `HTTP ${response.status}`);
            }
            result.pushed++;
        }
        catch (err) {
            item.retries++;
            result.failed++;
            result.errors.push(`Item ${item.id}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    return result;
}
async function pullServerDelta(serverUrl, accessToken, lastSyncAt) {
    const response = await fetch(`${serverUrl}/api/sync/pull?lastSyncAt=${encodeURIComponent(lastSyncAt)}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) {
        throw new Error(`Pull failed: HTTP ${response.status}`);
    }
    return response.json();
}
