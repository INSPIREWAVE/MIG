import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loans as loansApi, clients as clientsApi } from '../services/api';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n || 0);
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  defaulted: 'bg-red-200 text-red-800',
  paid: 'bg-gray-100 text-gray-500',
  cleared: 'bg-gray-100 text-gray-500',
};

export default function LoansPage() {
  const [items, setItems] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function load() {
    try {
      const res = await loansApi.list({ search: search || undefined, status: statusFilter || undefined });
      if (res.success) setItems(res.data);
    } catch { setError('Failed to load loans'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  useEffect(() => {
    clientsApi.list().then((r) => { if (r.success) setClientsList(r.data); });
  }, []);

  const portfolio = items.filter((l) => ['active','pending','overdue'].includes(l.status)).reduce((s: number, l: any) => s + (l.amount || 0), 0);
  const active = items.filter((l) => l.status === 'active').length;
  const overdue = items.filter((l) => l.status === 'overdue').length;
  const defaulted = items.filter((l) => l.status === 'defaulted').length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, clientId: parseInt(form.clientId), amount: parseFloat(form.amount), interest: parseFloat(form.interest) };
      const res = await loansApi.create(payload);
      if (res.success) { setShowModal(false); setForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this loan?')) return;
    await loansApi.delete(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Loans</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Loan
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Portfolio', value: fmt(portfolio) },
          { label: 'Active', value: active },
          { label: 'Overdue', value: overdue },
          { label: 'Defaulted', value: defaulted },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-lg font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search loan number or client…"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {['active','pending','overdue','defaulted','paid','cleared'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
                  <th className="px-4 py-3 text-left">Loan #</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Interest %</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Due</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No loans found</td></tr>
                ) : items.map((l: any) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{l.loanNumber}</td>
                    <td className="px-4 py-3">{l.clientName}</td>
                    <td className="px-4 py-3">{fmt(l.amount)}</td>
                    <td className="px-4 py-3">{l.interest}%</td>
                    <td className="px-4 py-3 font-semibold">{fmt(l.remainingBalance || l.balance)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || 'bg-gray-100 text-gray-500'}`}>{l.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/loans/${l.id}`)} className="text-blue-500 hover:text-blue-700"><Eye size={15} /></button>
                        <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Loan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Loan</h2>
            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Client *</label>
                <select
                  required
                  value={form.clientId || ''}
                  onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select client…</option>
                  {clientsList.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.clientNumber}</option>
                  ))}
                </select>
              </div>
              {[
                ['amount', 'Loan Amount', 'number', true],
                ['interest', 'Interest Rate (%)', 'number', true],
                ['loanDate', 'Loan Date', 'date', true],
                ['dueDate', 'Due Date', 'date', true],
                ['purpose', 'Purpose', 'text', false],
              ].map(([field, label, type, req]) => (
                <div key={String(field)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(label)}{req ? ' *' : ''}</label>
                  <input
                    type={String(type)}
                    required={Boolean(req)}
                    value={form[String(field)] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [String(field)]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Repayment Type</label>
                <select
                  value={form.repaymentType || 'monthly'}
                  onChange={(e) => setForm((f) => ({ ...f, repaymentType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="lump_sum">Lump Sum</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
