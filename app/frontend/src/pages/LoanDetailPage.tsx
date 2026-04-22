import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loans as loansApi, payments as paymentsApi } from '../services/api';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

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

const INST_STATUS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  partial: 'bg-blue-100 text-blue-700',
};

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<any>(null);
  const [installments, setInstallments] = useState<any[]>([]);
  const [loanPayments, setLoanPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payForm, setPayForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!id) return;
    const lid = parseInt(id);
    const [l, i, p] = await Promise.all([
      loansApi.get(lid),
      loansApi.getInstallments(lid),
      loansApi.getPayments(lid),
    ]);
    if (l.success) setLoan(l.data);
    if (i.success) setInstallments(i.data);
    if (p.success) setLoanPayments(p.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function handleAssessDefault() {
    if (!id) return;
    const res = await loansApi.assessDefault(parseInt(id));
    if (res.success) { alert(JSON.stringify(res.data, null, 2)); }
  }

  async function handleRecalculate() {
    if (!id) return;
    await loansApi.recalculate(parseInt(id));
    load();
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { loanId: parseInt(id!), amount: parseFloat(payForm.amount), paymentDate: payForm.paymentDate, paymentMethod: payForm.method || 'cash', notes: payForm.notes || '' };
      const res = await paymentsApi.add(payload);
      if (res.success) { setShowPayModal(false); setPayForm({}); load(); }
      else setError(res.error || 'Failed');
    } catch (e: any) { setError(e.response?.data?.error || 'Payment failed'); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
  if (!loan) return <div className="p-8 text-center text-red-500">Loan not found</div>;

  const paidCount = installments.filter((i) => i.status === 'paid').length;
  const progress = installments.length > 0 ? Math.round((paidCount / installments.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate('/loans')} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-800">Loan {loan.loanNumber}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[loan.status] || 'bg-gray-100 text-gray-500'}`}>{loan.status}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={handleRecalculate} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Recalculate</button>
          <button onClick={handleAssessDefault} className="px-3 py-1.5 text-xs border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50">Assess Default</button>
          <button onClick={() => setShowPayModal(true)} className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><DollarSign size={13} /> Add Payment</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['overview', 'installments', 'payments'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Loan Details</h3>
            <dl className="space-y-2 text-sm">
              {[
                ['Client', loan.clientName],
                ['Principal', fmt(loan.amount)],
                ['Interest Rate', `${loan.interest}%`],
                ['Total Payable', fmt(loan.totalPayable)],
                ['Balance Remaining', fmt(loan.remainingBalance || loan.balance)],
                ['Loan Date', loan.loanDate],
                ['Due Date', loan.dueDate],
                ['Repayment Type', loan.repaymentType],
                ['Purpose', loan.purpose],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-gray-500">{String(k)}</dt>
                  <dd className="text-gray-800 font-medium">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Repayment Progress</h3>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{paidCount} of {installments.length} paid</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle size={20} className="mx-auto text-green-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{paidCount}</p>
                <p className="text-xs text-gray-500">Paid</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Clock size={20} className="mx-auto text-yellow-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{installments.length - paidCount}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'installments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {installments.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No installments</td></tr>
                ) : installments.map((inst: any, i: number) => (
                  <tr key={inst.id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{inst.installmentNumber || i + 1}</td>
                    <td className="px-4 py-3">{inst.dueDate}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(inst.amount || inst.installmentAmount)}</td>
                    <td className="px-4 py-3">{fmt(inst.principal)}</td>
                    <td className="px-4 py-3">{fmt(inst.interest)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${INST_STATUS[inst.status] || 'bg-gray-100 text-gray-500'}`}>{inst.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loanPayments.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No payments</td></tr>
                ) : loanPayments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{p.paymentDate || p.date}</td>
                    <td className="px-4 py-3 font-semibold text-primary-600">{fmt(p.amount)}</td>
                    <td className="px-4 py-3">{p.paymentMethod || p.method}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.reference || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Payment</h2>
            {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handlePayment} className="space-y-3">
              {[
                ['amount', 'Amount (ZMW)', 'number'],
                ['paymentDate', 'Payment Date', 'date'],
              ].map(([field, label, type]) => (
                <div key={String(field)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{String(label)} *</label>
                  <input
                    type={String(type)}
                    required
                    value={payForm[String(field)] || ''}
                    onChange={(e) => setPayForm((f) => ({ ...f, [String(field)]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
                <select value={payForm.method || 'cash'} onChange={(e) => setPayForm((f) => ({ ...f, method: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {['cash','mobile_money','bank_transfer','cheque'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input value={payForm.notes || ''} onChange={(e) => setPayForm((f) => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPayModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-60">{saving ? 'Processing…' : 'Add Payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
