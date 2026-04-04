/*import { useEffect, useState } from 'react';
import ExpenseTrendChart from 'components/graphs/ExpenseTrendChart';
import CategoryPieChart from 'components/graphs/CategoryPieChart';
import FraudScoreChart from 'components/graphs/FraudScoreChart';
import IncomeExpenseChart from 'components/graphs/IncomeExpenseChart';
import PlayerService from 'services/users.services';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await PlayerService.getAllUserTransactionList({
        limit: 100
      });

      console.log('API RESPONSE:', res); // 👈 IMPORTANT

      const data = res?.response?.data || res?.data?.data || res?.data || [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('ERROR:', err);
      setTransactions([]);
    }
  };

  return (
    <div className="w-full px-[--margin-x] pb-10 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* ===== GRAPHS GRID ===== *}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ExpenseTrendChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
        <FraudScoreChart transactions={transactions} />
        <IncomeExpenseChart transactions={transactions} />
      </div>
    </div>
  );
}
*/

import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';

import ExpenseTrendChart from 'components/graphs/ExpenseTrendChart';
import CategoryPieChart from 'components/graphs/CategoryPieChart';
import FraudScoreChart from 'components/graphs/FraudScoreChart';
import IncomeExpenseChart from 'components/graphs/IncomeExpenseChart';

import PlayerService from 'services/users.services';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await PlayerService.getAllUserTransactionList({
        limit: 100
      });

      const data = res?.response?.data || res?.data?.data || res?.data || [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('ERROR:', err);
      setTransactions([]);
    }
  };

  // ===== FRAUD LOGIC (FALLBACK) =====
  const calculateFraudScore = (tr) => {
    let score = 0;
    const amount = Number(tr.amount || tr.transactionAmount || 0);

    if (amount > 10000) score += 30;
    if (amount > 50000) score += 40;
    if (tr.type?.toLowerCase() === 'withdraw') score += 20;

    return Math.min(score, 100);
  };

  // ===== NORMALIZE DATA =====
  const normalizedTransactions = useMemo(() => {
    return transactions.map((tr) => {
      const fraud = Number(tr.fraudScore) || Number(tr.fraud_score) || calculateFraudScore(tr);

      return {
        amount: Number(tr.amount || tr.transactionAmount || 0),
        type: (tr.type || tr.transactionType || '').toLowerCase(),
        categoryId: tr.categoryId || tr.category || 'Other',
        transactionDate: tr.transactionDate || tr.date,
        fraudScore: fraud,
        isFraud: fraud > 60
      };
    });
  }, [transactions]);

  // ===== FILTER BY MONTH =====
  const filteredTransactions = useMemo(() => {
    return normalizedTransactions.filter((tr) => {
      if (!tr.transactionDate) return false;

      return dayjs(tr.transactionDate).format('YYYY-MM') === selectedMonth;
    });
  }, [normalizedTransactions, selectedMonth]);

  return (
    <div className="w-full px-[--margin-x] pb-10 pt-6">
      {/* ===== TITLE ===== */}
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* ===== FILTER SECTION ===== */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Month Picker */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded border px-3 py-1"
        />

        {/* This Month */}
        <button
          onClick={() => setSelectedMonth(dayjs().format('YYYY-MM'))}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
          This Month
        </button>

        {/* Last Month */}
        <button
          onClick={() => setSelectedMonth(dayjs().subtract(1, 'month').format('YYYY-MM'))}
          className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600">
          Last Month
        </button>
      </div>

      {/* ===== NO DATA ===== */}
      {filteredTransactions.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500 shadow">
          No data available for selected month
        </div>
      ) : (
        /* ===== GRAPHS ===== */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ExpenseTrendChart transactions={filteredTransactions} />
          <CategoryPieChart transactions={filteredTransactions} />
          <FraudScoreChart transactions={filteredTransactions} />
          <IncomeExpenseChart transactions={filteredTransactions} />
        </div>
      )}
    </div>
  );
}
