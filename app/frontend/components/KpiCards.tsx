export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  trend?: string;
};

export const KpiCards = ({ metrics }: { metrics: KpiMetric[] }) => (
  <section aria-label="KPI summary">
    {metrics.map((metric) => (
      <article key={metric.id}>
        <h3>{metric.label}</h3>
        <p>{metric.value}</p>
        {metric.trend ? <small>{metric.trend}</small> : null}
      </article>
    ))}
  </section>
);
