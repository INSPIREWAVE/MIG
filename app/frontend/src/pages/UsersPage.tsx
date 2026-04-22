import { useEffect, useState } from 'react';
import { users as usersApi, auth as authApi } from '../services/api';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function UsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await usersApi.list();
      if (res.success) setItems(res.data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleToggle(id: number, current: boolean) {
    await usersApi.toggleStatus(id, !current);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this user?')) return;
    await usersApi.delete(id);
    load();
  }

  async function handleRoleChange(id: number, role: string, permissions: string) {
    await usersApi.updateRole(id, role, permissions);
    load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await authApi.register({
        username: form.username,
        password: form.password,
        role: form.role || 'staff',
        secQuestion: form.secQuestion || 'What is your pet name?',
        secAnswer: form.secAnswer || 'none',
        permissions: form.permissions || 'read,write',
      });
      if (res.success) { setShowModal(false); setForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading…</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Permissions</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                  <th className="px-4 py-3 text-left">Active</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users</td></tr>
                ) : items.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value, u.permissions || '')}
                        className="border border-gray-200 rounded px-2 py-1 text-xs"
                      >
                        {['admin','manager','staff','viewer'].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.permissions || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.lastLogin || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(u.id, u.isActive)} className={u.isActive ? 'text-green-500' : 'text-gray-400'}>
                        {u.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">New User</h2>
            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-3">
              {[['username','Username'],['password','Password'],['secQuestion','Security Question'],['secAnswer','Security Answer']].map(([f,l]) => (
                <div key={String(f)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(l)} *</label>
                  <input
                    type={f === 'password' ? 'password' : 'text'}
                    required
                    value={form[String(f)] || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [String(f)]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select value={form.role || 'staff'} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {['admin','manager','staff','viewer'].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-60">{saving ? 'Creating…' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
