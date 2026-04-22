import { useEffect, useState } from 'react';
import { backups as backupsApi } from '../services/api';
import { Plus, RotateCcw, Trash2, HardDrive } from 'lucide-react';

export default function BackupsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await backupsApi.list();
      if (res.success) setItems(res.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    setCreating(true);
    setError('');
    try {
      const res = await backupsApi.create('manual');
      if (res.success) load();
      else setError(res.error || 'Backup failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Backup failed'); }
    finally { setCreating(false); }
  }

  async function handleRestore(id: number, name: string) {
    if (!confirm(`Restore backup "${name}"? This will overwrite current data.`)) return;
    const res = await backupsApi.restore(id);
    if (res.success) alert('Backup restored successfully');
    else alert(res.error || 'Restore failed');
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this backup?')) return;
    await backupsApi.delete(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Backups</h1>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
        >
          <Plus size={16} /> {creating ? 'Creating…' : 'Create Backup'}
        </button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Size</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No backups yet</td></tr>
                ) : items.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <HardDrive size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-800">{b.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{b.type || 'manual'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{b.createdAt || b.date}</td>
                    <td className="px-4 py-3 text-gray-500">{b.size || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRestore(b.id, b.name)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          <RotateCcw size={13} /> Restore
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
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
