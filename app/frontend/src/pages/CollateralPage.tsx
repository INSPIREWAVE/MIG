import { useEffect, useState } from 'react';
import { collateral as collateralApi, loans as loansApi, clients as clientsApi } from '../services/api';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n || 0);
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  released: 'bg-gray-100 text-gray-500',
  forfeited: 'bg-red-100 text-red-700',
};

export default function CollateralPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loansList, setLoansList] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await collateralApi.list();
      if (res.success) {
        let data = res.data;
        if (statusFilter) data = data.filter((c: any) => c.status === statusFilter);
        setItems(data);
      }
    } catch { setError('Failed to load collateral'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [statusFilter]);

  useEffect(() => {
    Promise.all([loansApi.list(), clientsApi.list()]).then(([l, c]) => {
      if (l.success) setLoansList(l.data);
      if (c.success) setClientsList(c.data);
    });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, loanId: parseInt(form.loanId), clientId: parseInt(form.clientId), estimatedValue: parseFloat(form.estimatedValue), acceptedValue: parseFloat(form.acceptedValue || form.estimatedValue) };
      const res = await collateralApi.add(payload);
      if (res.success) { setShowModal(false); setForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function handleForfeit(id: number) {
    if (!confirm('Forfeit this collateral?')) return;
    const res = await collateralApi.forfeit(id);
    if (res.success) load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this collateral?')) return;
    await collateralApi.delete(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Collateral</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Collateral
        </button>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {['active','released','forfeited'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Loan #</th>
                  <th className="px-4 py-3 text-left">Est. Value</th>
                  <th className="px-4 py-3 text-left">Accepted Value</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No collateral found</td></tr>
                ) : items.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.itemType || c.type}</td>
                    <td className="px-4 py-3">{c.clientName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{c.loanNumber}</td>
                    <td className="px-4 py-3">{fmt(c.estimatedValue)}</td>
                    <td className="px-4 py-3">{fmt(c.acceptedValue)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.status === 'active' && (
                          <button onClick={() => handleForfeit(c.id)} className="text-orange-500 hover:text-orange-700" title="Forfeit">
                            <AlertTriangle size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600">
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Collateral</h2>
            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Client *</label>
                <select required value={form.clientId || ''} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select client…</option>
                  {clientsList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Loan *</label>
                <select required value={form.loanId || ''} onChange={(e) => setForm((f) => ({ ...f, loanId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select loan…</option>
                  {loansList.map((l: any) => <option key={l.id} value={l.id}>{l.loanNumber}</option>)}
                </select>
              </div>
              {[['itemType','Item Type/Description','text'],['estimatedValue','Estimated Value','number'],['acceptedValue','Accepted Value','number'],['description','Description','text']].map(([f,l,t]) => (
                <div key={String(f)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(l)}</label>
                  <input type={String(t)} required={f === 'itemType' || f === 'estimatedValue'} value={form[String(f)] || ''} onChange={(e) => setForm((prev) => ({ ...prev, [String(f)]: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-60">{saving ? 'Adding…' : 'Add Collateral'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
