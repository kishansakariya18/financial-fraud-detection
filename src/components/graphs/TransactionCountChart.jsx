import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { chartJsToNameValue } from 'utils/analyticsCharts';

/**
 * @param {object} transactionCountOverTime — Chart.js from GET /analytics/transactions
 */
export default function TransactionCountChart({ transactionCountOverTime }) {
  if (!transactionCountOverTime?.labels?.length) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No transaction count trend for this range
      </div>
    );
  }

  const data = chartJsToNameValue(transactionCountOverTime);
  const fill =
    transactionCountOverTime.datasets?.[0]?.backgroundColor || 'rgba(99, 102, 241, 0.55)';

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
        Transaction count over time
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill={fill} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
