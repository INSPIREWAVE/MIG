import { useEffect, useState } from 'react';
import { reports as reportsApi, payments as paymentsApi } from '../services/api';
import { BarChart2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function fmt(n: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n || 0);
}

export default function ReportsPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [runningBatch, setRunningBatch] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [dash, chart, trendsRes] = await Promise.all([
          reportsApi.getDashboard(),
          reportsApi.getPaymentChart('6months', 'month'),
          paymentsApi.getCollectionTrends(),
        ]);
        if (dash.success) setKpi(dash.data);
        if (chart.success) setChartData(chart.data);
        if (trendsRes.success) setTrends(trendsRes.data);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  async function handleBatch() {
    setRunningBatch(true);
    try {
      const res = await reportsApi.runBatchAssessment();
      if (res.success) setBatchResult(res.data);
    } finally { setRunningBatch(false); }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  const kpiItems = kpi ? [
    ['Total Clients', kpi.totalClients],
    ['Total Loans', kpi.totalLoans],
    ['Active Loans', kpi.activeLoans],
    ['Portfolio Value', fmt(kpi.portfolioValue)],
    ['Monthly Revenue', fmt(kpi.monthlyRevenue)],
    ['Collection Rate', `${kpi.collectionRate}%`],
    ['Default Rate', `${kpi.defaultRate}%`],
    ['Overdue Count', kpi.overdueCount],
    ['Total Collateral', fmt(kpi.totalCollateral)],
    ['Total Cleared', kpi.totalCleared],
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <button
          onClick={handleBatch}
          disabled={runningBatch}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
        >
          <RefreshCw size={15} className={runningBatch ? 'animate-spin' : ''} /> Run Batch Assessment
        </button>
      </div>

      {batchResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <strong>Batch Assessment:</strong> Processed {batchResult.processed} loans, applied {batchResult.feesApplied} fees.
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpiItems.map(([label, value]) => (
          <div key={String(label)} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{String(label)}</p>
            <p className="text-lg font-bold text-gray-800">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2"><BarChart2 size={16} /> Payment Trends (6 months)</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => fmt(Number(v))} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No data</p>
          )}
        </div>

        {/* Collection Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Collection Trends</h2>
          {trends?.monthly?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trends.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => fmt(Number(v))} />
                <Bar dataKey="collected" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No trend data</p>
          )}
        </div>
      </div>
    </div>
  );
}
