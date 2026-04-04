import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function CategoryPieChart({ transactions }) {
  const categoryMap = {};

  transactions.forEach((tr) => {
    if (tr.categoryId) {
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
