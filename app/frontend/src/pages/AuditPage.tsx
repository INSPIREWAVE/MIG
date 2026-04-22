import { useEffect, useState } from 'react';
import { audit as auditApi } from '../services/api';
import { Trash2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function AuditPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  async function load() {
    setLoading(true);
    try {
      const res = await auditApi.list(limit);
      if (res.success) setItems(res.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [limit]);

  async function handleClear() {
    if (!confirm('Clear entire audit log? This cannot be undone.')) return;
    await auditApi.clear();
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return;
    await auditApi.deleteEntry(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Audit Log</h1>
        <div className="flex items-center gap-3">
          <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            {[50, 100, 200, 500].map((n) => <option key={n} value={n}>Last {n}</option>)}
          </select>
          <button onClick={load} className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"><RefreshCw size={15} /></button>
          {isAdmin && (
            <button onClick={handleClear} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100">Clear Log</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Entity</th>
                  <th className="px-4 py-3 text-left">Entity ID</th>
                  <th className="px-4 py-3 text-left">New Value</th>
                  {isAdmin && <th className="px-4 py-3 text-left">Del</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No audit entries</td></tr>
                ) : items.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{entry.createdAt || entry.timestamp}</td>
                    <td className="px-4 py-3 font-medium">{entry.action}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.entityType}</td>
                    <td className="px-4 py-3 text-gray-500">{entry.entityId}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-xs text-gray-500">{String(entry.newValue || '').slice(0, 80) || '—'}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(entry.id)} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
