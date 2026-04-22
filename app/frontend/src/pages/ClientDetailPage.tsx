import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clients as clientsApi } from '../services/api';
import { ArrowLeft, User, CreditCard, FileText, Activity, ShieldOff, Shield } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n || 0);
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [clientLoans, setClientLoans] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    const cid = parseInt(id);
    Promise.all([
      clientsApi.get(cid),
      clientsApi.getLoans(cid),
      clientsApi.getActivity(cid, 20),
    ]).then(([c, l, a]) => {
      if (c.success) setClient(c.data);
      if (l.success) setClientLoans(l.data);
      if (a.success) setActivity(a.data);
    }).finally(() => setLoading(false));
  }, [id]);

  async function toggleBlacklist() {
    if (!client || !id) return;
    const bl = !client.blacklisted;
    const reason = bl ? prompt('Blacklist reason:') || '' : '';
    await clientsApi.setBlacklist(parseInt(id), { blacklisted: bl, reason });
    const res = await clientsApi.get(parseInt(id));
    if (res.success) setClient(res.data);
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
  if (!client) return <div className="p-8 text-center text-red-500">Client not found</div>;

  const TABS = ['overview', 'loans', 'activity'];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/clients')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>
        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{client.clientNumber}</span>
        {client.blacklisted && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Blacklisted</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><User size={15} /> Personal Info</h3>
            <dl className="space-y-2 text-sm">
              {[
                ['Phone', client.phone],
                ['Email', client.email],
                ['NRC', client.nrc],
                ['Date of Birth', client.dateOfBirth],
                ['Address', client.address],
                ['Occupation', client.occupation],
                ['Monthly Income', client.monthlyIncome ? fmt(client.monthlyIncome) : '—'],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-gray-500">{String(k)}</dt>
                  <dd className="text-gray-800 font-medium">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Shield size={15} /> Risk & KYC</h3>
            <dl className="space-y-2 text-sm">
              {[
                ['KYC Status', client.kycStatus || 'pending'],
                ['Risk Level', client.riskLevel || 'low'],
                ['Credit Score', client.creditScore || '—'],
                ['Client Status', client.clientStatus || 'active'],
                ['Blacklisted', client.blacklisted ? 'Yes' : 'No'],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-gray-500">{String(k)}</dt>
                  <dd className="text-gray-800 font-medium">{String(v)}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={toggleBlacklist}
              className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center ${
                client.blacklisted
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {client.blacklisted ? <><Shield size={14} /> Remove Blacklist</> : <><ShieldOff size={14} /> Blacklist</>}
            </button>
          </div>
        </div>
      )}

      {tab === 'loans' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <CreditCard size={16} className="text-primary-600" />
            <span className="font-semibold text-gray-700">Loans ({clientLoans.length})</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Loan #</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientLoans.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No loans</td></tr>
                ) : clientLoans.map((l: any) => (
                  <tr key={l.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/loans/${l.id}`)}>
                    <td className="px-4 py-3 font-mono text-xs">{l.loanNumber}</td>
                    <td className="px-4 py-3">{fmt(l.amount)}</td>
                    <td className="px-4 py-3">{fmt(l.remainingBalance || l.balance)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{l.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Activity size={16} className="text-primary-600" />
            <span className="font-semibold text-gray-700">Activity Log</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activity.length === 0 ? (
              <p className="px-4 py-6 text-center text-gray-400">No activity</p>
            ) : activity.map((a: any, i: number) => (
              <div key={i} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-800">{a.action}</span>
                  <span className="text-xs text-gray-400">{a.createdAt || a.timestamp}</span>
                </div>
                {a.newValue && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{String(a.newValue).slice(0, 80)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
