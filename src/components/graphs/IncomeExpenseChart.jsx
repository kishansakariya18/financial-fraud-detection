import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function IncomeExpenseChart({ transactions }) {
  let income = 0;
  let expense = 0;

  transactions.forEach((tr) => {
    const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;

    if (['credit', 'income', 'deposit'].includes(tr.type?.toLowerCase())) {
      income += amount;
    } else {
      expense += amount;
    }
  });

  const data = [
    { name: 'Income', value: income },
    { name: 'Expense', value: expense }
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
