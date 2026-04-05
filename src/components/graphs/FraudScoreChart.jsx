import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { chartJsToComboRows, chartJsToNameValue } from 'utils/analyticsCharts';

const STATUS_FALLBACK_COLORS = [
  'rgba(234, 179, 8, 0.85)',
  'rgba(34, 197, 94, 0.85)',
  'rgba(249, 115, 22, 0.85)',
  'rgba(220, 38, 38, 0.85)'
];

/**
 * @param {object} [fraudStatusOnTransactions] — Chart.js from GET /analytics/fraud
 * @param {object} [fraudScoreOverTime]
 * @param {object} [fraudScoreHistogram]
 */
export default function FraudScoreChart({
  fraudStatusOnTransactions,
  fraudScoreOverTime,
  fraudScoreHistogram,
  transactions = []
}) {
  const statusData = fraudStatusOnTransactions?.labels?.length
    ? chartJsToNameValue(fraudStatusOnTransactions)
    : [];
  const statusColors = fraudStatusOnTransactions?.datasets?.[0]?.backgroundColor;
  const fills = Array.isArray(statusColors) ? statusColors : STATUS_FALLBACK_COLORS;

  const histData = fraudScoreHistogram?.labels?.length
    ? chartJsToNameValue(fraudScoreHistogram)
    : [];

  const { rows, dataKeys, datasets } = fraudScoreOverTime?.labels?.length
    ? chartJsToComboRows(fraudScoreOverTime)
    : { rows: [], dataKeys: [], datasets: [] };

  const legacyBars =
    !fraudStatusOnTransactions?.labels?.length && Array.isArray(transactions) && transactions.length
      ? transactions.slice(0, 12).map((tr, i) => ({
          name: `T${i + 1}`,
          score: Number(tr.fraudScore) || 0
        }))
      : [];

  const hasApiCharts = statusData.length > 0 || rows.length > 0 || histData.length > 0;

  if (!hasApiCharts && legacyBars.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No fraud analytics for this range
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-2xl bg-white p-5 shadow-md">
      {statusData.length > 0 ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Transactions by fraud status
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-dark-600"
              />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={fills[index % fills.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : legacyBars.length > 0 ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Fraud score (sample)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={legacyBars}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Fraud score over time
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={rows}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-dark-600"
              />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={datasets[i]?.borderColor || '#DC2626'}
                  strokeWidth={2}
                  dot={false}
                  name={key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {histData.length > 0 ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Fraud score distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-dark-600"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="rgba(239, 68, 68, 0.65)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}
