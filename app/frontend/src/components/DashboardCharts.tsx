export type ChartPoint = { label: string; value: number };

export const DashboardCharts = ({ points }: { points: ChartPoint[] }) => (
  <section aria-label="Portfolio performance chart">
    <ul>
      {points.map((point) => (
        <li key={point.label}>
          {point.label}: {point.value}
        </li>
      ))}
    </ul>
  </section>
);
