/*import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FraudBarChart({ data }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Fraud by Category</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fraudCount" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
*/

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function CategoryPieChart({ transactions = [] }) {
  // ✅ SAFETY CHECK
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-gray-500 shadow-md">
        No data available
      </div>
    );
  }

  const categoryMap = {};

  transactions.forEach((tr) => {
    if (tr?.categoryId) {
      categoryMap[tr.categoryId] = (categoryMap[tr.categoryId] || 0) + 1;
    }
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key]
  }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold">Category Distribution</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
