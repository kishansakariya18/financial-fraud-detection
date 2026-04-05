import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import dayjs from 'dayjs';
import { chartJsToComboRows } from 'utils/analyticsCharts';

function legacyTrend(transactions) {
  const byDay = {};
  transactions.forEach((tr) => {
    const d = tr.transactionDate || tr.date;
    if (!d) return;
    const key = dayjs(d).format('YYYY-MM-DD');
    const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;
    const t = String(tr.type || '').toUpperCase();
    if (
      t !== 'EXPENSE' &&
      !['expense', 'debit', 'withdraw'].includes(String(tr.type || '').toLowerCase())
    ) {
      return;
    }
    byDay[key] = (byDay[key] || 0) + amount;
  });
  return Object.keys(byDay)
    .sort()
    .map((name) => ({ name, volume: byDay[name] }));
}

/**
 * @param {object} [volumeOverTime] — Chart.js shape from GET /analytics/transactions (volumeOverTime)
 */
export default function ExpenseTrendChart({ volumeOverTime, transactions = [] }) {
  if (volumeOverTime?.labels?.length) {
    const { rows, dataKeys, datasets } = chartJsToComboRows(volumeOverTime);
    if (rows.length === 0) {
      return (
        <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
          No volume data for this range
        </div>
      );
    }
    return (
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
          Transaction volume over time
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={datasets[i]?.borderColor || '#3B82F6'}
                strokeWidth={2}
                dot={false}
                name={key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const data = legacyTrend(transactions);
  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No expense trend data
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
        Expense trend (legacy)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
