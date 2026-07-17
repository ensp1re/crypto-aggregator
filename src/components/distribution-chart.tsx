export function DistributionChart({
  title,
  description,
  data,
  total,
}: {
  title: string;
  description: string;
  data: Array<{ label: string; value: number }>;
  total: number;
}) {
  return (
    <section className="chart-panel" aria-labelledby={`${title.replaceAll(" ", "-").toLowerCase()}-title`}>
      <header>
        <h2 id={`${title.replaceAll(" ", "-").toLowerCase()}-title`}>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="bar-chart" aria-hidden="true">
        {data.map((item, index) => (
          <div className="bar-row" key={item.label}>
            <span>{item.label}</span>
            <div className="bar-track"><span className={`bar-fill tone-${index % 4}`} style={{ width: `${(item.value / total) * 100}%` }} /></div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <table className="data-table compact-table">
        <caption className="sr-only">{title} data</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Programs</th><th scope="col">Share</th></tr></thead>
        <tbody>
          {data.map((item) => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value}</td><td>{Math.round((item.value / total) * 100)}%</td></tr>)}
        </tbody>
      </table>
    </section>
  );
}
