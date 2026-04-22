import { useEffect, useState } from 'react';
import { reports, loans } from '../services/api';
import {
  Users, CreditCard, Wallet, TrendingDown, TrendingUp,
  AlertTriangle, Shield, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface KPI {
  totalClients: number;
  activeLoans: number;
  portfolioValue: number;
  collectionRate: number;
  defaultRate: number;
  monthlyRevenue: number;
  overdueCount: number;
  totalCollateral: number;
  totalLoans: number;
  totalCleared: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n);
}

function KpiCard({
  label, value, icon: Icon, color
}: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, chartRes, overdueRes] = await Promise.all([
          reports.getDashboard(),
          reports.getPaymentChart('6months', 'month'),
          loans.getOverdue(),
        ]);
        if (dashRes.success) setKpi(dashRes.data);
        if (chartRes.success) setChartData(chartRes.data);
        if (overdueRes.success) setOverdue(overdueRes.data.slice(0, 5));
      } catch {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading…</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {kpi && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total Clients" value={kpi.totalClients} icon={Users} color="bg-blue-500" />
          <KpiCard label="Active Loans" value={kpi.activeLoans} icon={CreditCard} color="bg-primary-500" />
          <KpiCard label="Portfolio Value" value={fmt(kpi.portfolioValue)} icon={Wallet} color="bg-purple-500" />
          <KpiCard label="Monthly Revenue" value={fmt(kpi.monthlyRevenue)} icon={BarChart2} color="bg-indigo-500" />
          <KpiCard label="Collection Rate" value={`${kpi.collectionRate}%`} icon={TrendingUp} color="bg-green-500" />
          <KpiCard label="Default Rate" value={`${kpi.defaultRate}%`} icon={TrendingDown} color="bg-red-500" />
          <KpiCard label="Overdue Count" value={kpi.overdueCount} icon={AlertTriangle} color="bg-orange-500" />
          <KpiCard label="Total Collateral" value={fmt(kpi.totalCollateral)} icon={Shield} color="bg-teal-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Trends</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => fmt(Number(v))} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-12">No chart data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Overdue Installments</h2>
          {overdue.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No overdue installments 🎉</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase border-b border-gray-100">
                    <th className="pb-2">Loan #</th>
                    <th className="pb-2">Client</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {overdue.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 font-mono text-xs">{row.loanNumber}</td>
                      <td className="py-2">{row.clientName}</td>
                      <td className="py-2 text-red-600 font-semibold">{fmt(row.amount || row.installmentAmount || 0)}</td>
                      <td className="py-2 text-gray-500">{row.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
