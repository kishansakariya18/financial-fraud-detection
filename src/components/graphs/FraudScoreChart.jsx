import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FraudScoreChart({ transactions }) {
  const data = transactions.slice(0, 10).map((tr, i) => ({
    name: `T${i + 1}`,
    score: Number(tr.fraudScore) || 0
  }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 font-semibold">Fraud Score Analysis</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
