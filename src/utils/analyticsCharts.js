/**
 * Backend analytics service returns Chart.js–shaped payloads: { labels, datasets }.
 * These helpers map them into Recharts-friendly rows.
 */

export function chartJsToComboRows(chartJs) {
  if (!chartJs?.labels?.length) return { rows: [], dataKeys: [], datasets: [] };
  const { labels, datasets = [] } = chartJs;
  const dataKeys = datasets.map((d, i) => d.label || `series_${i}`);
  const rows = labels.map((label, idx) => {
    const row = { name: label };
    datasets.forEach((ds, di) => {
      row[dataKeys[di]] = Number(ds.data?.[idx] ?? 0);
    });
    return row;
  });
  return { rows, dataKeys, datasets };
}

/** Single-series bar: [{ name, value }] */
export function chartJsToNameValue(chartJs) {
  if (!chartJs?.labels?.length) return [];
  const ds = chartJs.datasets?.[0];
  if (!ds?.data) return [];
  return chartJs.labels.map((name, i) => ({
    name,
    value: Number(ds.data[i] ?? 0)
  }));
}

export function chartJsToPieData(chartJs) {
  return chartJsToNameValue(chartJs).filter((x) => x.value > 0);
}
