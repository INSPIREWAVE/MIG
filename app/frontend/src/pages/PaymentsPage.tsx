import { useEffect, useState } from 'react';
import { payments as paymentsApi, loans as loansApi } from '../services/api';
import { Plus, RotateCcw } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n || 0);
}

export default function PaymentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loansList, setLoansList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [methodFilter, setMethodFilter] = useState('');

  async function load() {
    try {
      const res = await paymentsApi.list(methodFilter ? { method: methodFilter } : undefined);
      if (res.success) setItems(res.data);
    } catch { setError('Failed to load payments'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [methodFilter]);

  useEffect(() => {
    loansApi.list({ status: 'active' }).then((r) => { if (r.success) setLoansList(r.data); });
  }, []);

  const total = items.reduce((s: number, p: any) => s + (p.amount || 0), 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        loanId: parseInt(form.loanId),
        amount: parseFloat(form.amount),
        paymentDate: form.paymentDate,
        paymentMethod: form.method || 'cash',
        reference: form.reference || '',
        notes: form.notes || '',
      };
      const res = await paymentsApi.add(payload);
      if (res.success) { setShowModal(false); setForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function handleReverse(id: number) {
    const reason = prompt('Reversal reason:');
    if (!reason) return;
    await paymentsApi.reverse(id, { reason, reversedBy: 'admin' });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Payment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Payments</p>
          <p className="text-xl font-bold text-gray-800">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-primary-600">{fmt(total)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All methods</option>
          {['cash','mobile_money','bank_transfer','cheque'].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Loan #</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No payments found</td></tr>
                ) : items.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{p.paymentDate || p.date}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.loanNumber}</td>
                    <td className="px-4 py-3">{p.clientName}</td>
                    <td className="px-4 py-3 font-semibold text-primary-600">{fmt(p.amount)}</td>
                    <td className="px-4 py-3">{p.paymentMethod || p.method}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.reference || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleReverse(p.id)} className="text-orange-500 hover:text-orange-700" title="Reverse">
                        <RotateCcw size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Payment</h2>
            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Loan *</label>
                <select required value={form.loanId || ''} onChange={(e) => setForm((f) => ({ ...f, loanId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select loan…</option>
                  {loansList.map((l: any) => <option key={l.id} value={l.id}>{l.loanNumber} — {l.clientName}</option>)}
                </select>
              </div>
              {[['amount','Amount (ZMW)','number'],['paymentDate','Payment Date','date'],['reference','Reference','text']].map(([f,l,t]) => (
                <div key={String(f)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(l)}</label>
                  <input type={String(t)} required={f === 'amount' || f === 'paymentDate'} value={form[String(f)] || ''} onChange={(e) => setForm((prev) => ({ ...prev, [String(f)]: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                <select value={form.method || 'cash'} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {['cash','mobile_money','bank_transfer','cheque'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input value={form.notes || ''} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-60">{saving ? 'Adding…' : 'Add Payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
