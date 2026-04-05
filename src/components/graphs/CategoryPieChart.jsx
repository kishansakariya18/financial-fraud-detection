import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { chartJsToPieData } from 'utils/analyticsCharts';
import { getTransactionCategoryLabel } from '../../app/pages/transactions/transactionCategoryLabel';

const COLORS = [
  '#0EA5E9',
  '#22C55E',
  '#A855F7',
  '#F59E0B',
  '#EF4444',
  '#6366F1',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#8B5CF6',
  '#84CC16',
  '#06B6D4'
];

/**
 * @param {object} [byCategory] — Chart.js shape from GET /analytics/transactions (byCategory)
 */
export default function CategoryPieChart({ byCategory, transactions = [] }) {
  let data = [];

  if (byCategory?.labels?.length) {
    data = chartJsToPieData(byCategory);
  } else if (Array.isArray(transactions) && transactions.length > 0) {
    const categoryMap = {};
    transactions.forEach((tr) => {
      if (!tr?.categoryId && !tr?.category) return;
      const label = getTransactionCategoryLabel(tr);
      categoryMap[label] = (categoryMap[label] || 0) + 1;
    });
    data = Object.keys(categoryMap).map((name) => ({
      name,
      value: categoryMap[name]
    }));
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No category data for this range
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-dark-100">Spending by category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name === 'value' ? 'Amount' : name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
