import { DashboardCharts } from '../components/DashboardCharts';
import { KpiCards } from '../components/KpiCards';

const metrics = [
  { id: 'active-loans', label: 'Active Loans', value: '124', trend: '+7%' },
  { id: 'portfolio', label: 'Portfolio Value', value: '$1.34M', trend: '+3.1%' },
  { id: 'defaults', label: 'Default Rate', value: '1.8%', trend: '-0.4%' }
];

const chartPoints = [
  { label: 'Jan', value: 120000 },
  { label: 'Feb', value: 131000 },
  { label: 'Mar', value: 149000 }
];

export const DashboardPage = () => (
  <>
    <h1>Dashboard</h1>
    <KpiCards metrics={metrics} />
    <DashboardCharts points={chartPoints} />
  </>
);
