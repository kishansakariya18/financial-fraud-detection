import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { chartJsToNameValue } from 'utils/analyticsCharts';

/**
 * @param {object} [byPaymentMethod] — Chart.js from GET /analytics/transactions
 */
export default function PaymentMethodBarChart({ byPaymentMethod }) {
  if (!byPaymentMethod?.labels?.length) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No payment method data for this range
      </div>
    );
  }

  const data = chartJsToNameValue(byPaymentMethod);
  const fill = byPaymentMethod.datasets?.[0]?.backgroundColor || 'rgba(168, 85, 247, 0.7)';

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
        Volume by payment method
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [v, 'Amount']} />
          <Bar dataKey="value" fill={fill} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
