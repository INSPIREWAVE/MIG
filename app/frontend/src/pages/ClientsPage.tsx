import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clients as clientsApi } from '../services/api';
import { Plus, Search, Eye, Trash2, UserCheck } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  blacklisted: 'bg-red-100 text-red-700',
};

export default function ClientsPage() {
  const [items, setItems] = useState<any[]>([]);
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
      const res = await clientsApi.list({ search, status: statusFilter || undefined });
      if (res.success) setItems(res.data);
    } catch { setError('Failed to load clients'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await clientsApi.create(form);
      if (res.success) { setShowModal(false); setForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this client?')) return;
    await clientsApi.delete(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Client
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, NRC…"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
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
                  <th className="px-4 py-3 text-left">Client #</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">NRC</th>
                  <th className="px-4 py-3 text-left">KYC</th>
                  <th className="px-4 py-3 text-left">Risk</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No clients found</td></tr>
                ) : items.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.clientNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{c.nrc}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{c.kycStatus || 'pending'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">{c.riskLevel || 'low'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.clientStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {c.clientStatus || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/clients/${c.id}`)} className="text-blue-500 hover:text-blue-700">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={15} />
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

      {/* New Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Client</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              {[
                ['name', 'Full Name', 'text', true],
                ['phone', 'Phone', 'text', true],
                ['email', 'Email', 'email', false],
                ['nrc', 'NRC Number', 'text', false],
                ['dateOfBirth', 'Date of Birth', 'date', false],
                ['address', 'Address', 'text', false],
                ['occupation', 'Occupation', 'text', false],
                ['monthlyIncome', 'Monthly Income', 'number', false],
              ].map(([field, label, type, required]) => (
                <div key={String(field)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(label)}{required ? ' *' : ''}</label>
                  <input
                    type={String(type)}
                    required={Boolean(required)}
                    value={form[String(field)] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [String(field)]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
