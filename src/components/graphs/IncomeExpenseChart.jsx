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

function legacyFromTransactions(transactions) {
  let income = 0;
  let expense = 0;
  transactions.forEach((tr) => {
    const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;
    const t = String(tr.type || '').toUpperCase();
    if (
      t === 'INCOME' ||
      ['credit', 'income', 'deposit'].includes(String(tr.type || '').toLowerCase())
    ) {
      income += amount;
    } else {
      expense += amount;
    }
  });
  return [
    { name: 'Income', value: income },
    { name: 'Expense', value: expense }
  ];
}

/**
 * @param {object} [comparison] — Chart.js shape from GET /analytics/income-vs-expense (comparison)
 * @param {object} [overTime] — Chart.js shape (overTime)
 * @param {Array} [transactions] — fallback when API props omitted
 */
export default function IncomeExpenseChart({ comparison, overTime, transactions = [] }) {
  const hasComparison = comparison?.labels?.length > 0;
  const hasOverTime = overTime?.labels?.length > 0;

  const barData = hasComparison
    ? chartJsToNameValue(comparison)
    : legacyFromTransactions(transactions);
  const barColors = comparison?.datasets?.[0]?.backgroundColor;
  const barFills = Array.isArray(barColors) ? barColors : ['#22C55E', '#EF4444'];

  const { rows, dataKeys, datasets } = hasOverTime
    ? chartJsToComboRows(overTime)
    : { rows: [], dataKeys: [], datasets: [] };

  const showTotalsBar =
    hasComparison || (!hasComparison && !hasOverTime && transactions.length > 0);

  const nothingToShow =
    !hasComparison && !hasOverTime && (!transactions.length || barData.every((d) => d.value === 0));
  if (nothingToShow) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No income / expense data for this range
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-2xl bg-white p-5 shadow-md">
      {showTotalsBar ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Income vs expense (totals)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-dark-600"
              />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v, 'Amount']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={barFills[index % barFills.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {hasOverTime && rows.length > 0 ? (
        <div>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">
            Income & expense over time
          </h3>
          <ResponsiveContainer width="100%" height={280}>
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
                  stroke={datasets[i]?.borderColor || datasets[i]?.backgroundColor || '#3B82F6'}
                  strokeWidth={2}
                  dot={false}
                  name={key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}
