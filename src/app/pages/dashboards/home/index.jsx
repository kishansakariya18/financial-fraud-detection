/*
import { Page } from 'components/shared/Page';
import { useState, useMemo } from 'react';
import PlayerService from 'services/users.services';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { columns } from '../../transactions/columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TRANSACTION_CATEGORIES } from '../../transactions/constants';

export default function Home() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // ===== Metrics =====
  const metrics = useMemo(() => {
    if (!transactions.length) {
      return { monthlyExpense: 0, avgFraudScore: 0, trendingCategory: 'N/A' };
    }

    const now = dayjs();

    const currentMonthTransactions = transactions.filter(
      (tr) =>
        //dayjs(tr.transactionDate).isSame(now, 'month')
        dayjs(tr.transactionDate).format('YYYY-MM') === now.format('YYYY-MM')
    );

    const monthlyExpense = currentMonthTransactions
      //.filter((tr) => tr.type === 'EXPENSE')
      .filter((tr) => ['expense', 'debit', 'withdraw'].includes(tr.type?.toLowerCase()))
      //.reduce((acc, tr) => acc + (Number(tr.amount) || 0), 0);
      .reduce((acc, tr) => {
        const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;
        return acc + amount;
      }, 0);

    const avgFraudScore =
      transactions.reduce((acc, tr) => acc + (Number(tr.fraudScore) || 0), 0) / transactions.length;

    const categoryCounts = transactions.reduce((acc, tr) => {
      acc[tr.categoryId] = (acc[tr.categoryId] || 0) + 1;
      return acc;
    }, {});

    const trendingCategoryId = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    const trendingCategoryLabel =
      TRANSACTION_CATEGORIES.find((c) => c.value === trendingCategoryId)?.label || 'N/A';

    return {
      monthlyExpense: monthlyExpense.toFixed(2),
      avgFraudScore: avgFraudScore.toFixed(1),
      trendingCategory: trendingCategoryLabel
    };
  }, [transactions]);

  // ===== Fetch Data =====
  const fetchTransactions = async () => {
    const result = await PlayerService.getAllUserTransactionList({
      limit,
      sortOrder: 'desc'
    });

    console.log('FULL RESPONSE:', result);

    if (result?.status === 200) {
      const data = result?.response?.data || [];
      console.log('TRANSACTIONS:', data);
      setTransactions(data);

      return {
        status: 200,
        data: data.slice(0, 5),
        totalRecords: Math.min(data.length, 5)
      };
    }

    return { status: result?.status, error: result?.error };
  };

  const { table, isLoading, tableSettings } = useTable({
    columns,
    fetchData: fetchTransactions,
    initialSettings: {
      tableSettings: { pagination: false }
    }
  });

  return (
    <Page title="Fraud Detection Dashboard">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ===== PAGE TITLE ===== *}
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard Overview</h1>

        {/* ===== CARDS SECTION ===== *}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Expense *}
          <div className="rounded-2xl border bg-white p-5 shadow-md transition hover:shadow-lg">
            <p className="text-sm text-gray-500">Monthly Expense</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-600">₹{metrics.monthlyExpense}</h2>
          </div>

          {/* Fraud Score *}
          <div className="rounded-2xl border bg-white p-5 shadow-md transition hover:shadow-lg">
            <p className="text-sm text-gray-500">Avg Fraud Score</p>
            <h2 className="mt-2 text-2xl font-bold text-purple-600">{metrics.avgFraudScore}</h2>
          </div>

          {/* Category *}
          <div className="rounded-2xl border bg-white p-5 shadow-md transition hover:shadow-lg">
            <p className="text-sm text-gray-500">Trending Category</p>
            <h2 className="mt-2 text-xl font-semibold text-orange-500">
              {metrics.trendingCategory}
            </h2>
          </div>

          {/* Action Card *}
          <div
            onClick={() => navigate('/dashboards/transactions/create')}
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white shadow-md transition hover:scale-[1.03]">
            <p className="text-sm opacity-80">Quick Action</p>
            <h2 className="mt-2 text-xl font-bold">+ Add Transaction</h2>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm">
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* ===== TABLE SECTION ===== *}
        <div className="mt-10 rounded-2xl border bg-white p-5 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          </div>

          <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
        </div>
      </div>
    </Page>
  );
}
*/
/*
import { Page } from 'components/shared/Page';
import { useState, useMemo } from 'react';
import PlayerService from 'services/users.services';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { columns } from '../../transactions/columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TRANSACTION_CATEGORIES } from '../../transactions/constants';

export default function Home() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [limit, setLimit] = useState(5);

  // ===== METRICS =====
  const metrics = useMemo(() => {
    if (!transactions.length) {
      return {
        monthlyExpense: '0.00',
        avgFraudScore: '0',
        trendingCategory: 'N/A'
      };
    }

    // ✅ Current month filter
    const currentMonthTransactions = transactions.filter(
      (tr) => dayjs(tr.transactionDate).format('YYYY-MM') === dayjs().format('YYYY-MM')
    );

    // ✅ Monthly Expense
    const monthlyExpense = currentMonthTransactions
      .filter((tr) => ['expense', 'debit', 'withdraw'].includes(tr.type?.toLowerCase()))
      .reduce((acc, tr) => {
        const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;
        return acc + amount;
      }, 0);

    // ✅ Avg Fraud Score
    const avgFraudScore =
      transactions.length > 0
        ? (
            transactions.reduce((acc, tr) => acc + (Number(tr.fraudScore) || 0), 0) /
            transactions.length
          ).toFixed(1)
        : '0';

    // ✅ Category Count
    const categoryCounts = {};
    transactions.forEach((tr) => {
      if (tr.categoryId) {
        categoryCounts[tr.categoryId] = (categoryCounts[tr.categoryId] || 0) + 1;
      }
    });

    // ✅ Trending Category
    let trendingCategoryId = null;

    if (Object.keys(categoryCounts).length > 0) {
      trendingCategoryId = Object.keys(categoryCounts).reduce((a, b) =>
        categoryCounts[a] > categoryCounts[b] ? a : b
      );
    }

    const trendingCategoryLabel =
      TRANSACTION_CATEGORIES.find((c) => c.value === trendingCategoryId)?.label || 'N/A';

    return {
      monthlyExpense: monthlyExpense.toFixed(2),
      avgFraudScore,
      trendingCategory: trendingCategoryLabel
    };
  }, [transactions]);

  // ===== FETCH =====
    const fetchTransactions = async () => {
    try {
      const result = await PlayerService.getAllUserTransactionList({
        limit,
        sortOrder: 'desc'
      });

      console.log('API RESULT:', result); // 🔥 DEBUG

      if (result && result.status === 200) {
        const data = result?.response?.data || [];

        setTransactions(data);

        return {
          status: 200,
          data: data,
          totalRecords: data.length
        };
    }

      return { status: result?.status || 500, error: result?.error || 'Unknown error' };

    } catch (error) {
      console.error('FETCH ERROR:', error);

      return {
        status: 500,
        error: error.message
      };
    }

  const { table, isLoading, tableSettings } = useTable({
    columns,
    fetchData: fetchTransactions,
    dependencies: [limit], // 🔥 IMPORTANT
    initialSettings: {
      tableSettings: { pagination: false }
    }
  });

  return (
    <Page title="Fraud Detection Dashboard">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ===== TITLE ===== *}
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard Overview</h1>

        {/* ===== CARDS ===== *}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Monthly Expense</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-600">₹{metrics.monthlyExpense}</h2>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Avg Fraud Score</p>
            <h2 className="mt-2 text-2xl font-bold text-purple-600">{metrics.avgFraudScore}</h2>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Trending Category</p>
            <h2 className="mt-2 text-xl font-semibold text-orange-500">
              {metrics.trendingCategory}
            </h2>
          </div>

          <div
            onClick={() => navigate('/dashboards/transactions/create')}
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white shadow-md">
            <p className="text-sm opacity-80">Quick Action</p>
            <h2 className="mt-2 text-xl font-bold">+ Add Transaction</h2>
          </div>
        </div>

        {/* ===== FILTER ===== *}
        <div className="mb-4 mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border px-3 py-1 text-sm">
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* ===== TABLE ===== *}
        <div className="rounded-2xl border bg-white p-5 shadow-md">
          <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
        </div>
      </div>
    </Page>
  );
}
  */
import { Page } from 'components/shared/Page';
import { useState, useMemo } from 'react';
import PlayerService from 'services/users.services';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { columns } from '../../transactions/columns';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { getTransactionCategoryLabel } from '../../transactions/transactionCategoryLabel';

export default function Home() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [limit, setLimit] = useState(5);

  // ================= METRICS =================
  const metrics = useMemo(() => {
    if (!transactions.length) {
      return {
        monthlyExpense: '0.00',
        avgFraudScore: '0',
        trendingCategory: 'N/A'
      };
    }

    // Current month filter
    const currentMonthTransactions = transactions.filter(
      (tr) => dayjs(tr.transactionDate).format('YYYY-MM') === dayjs().format('YYYY-MM')
    );

    // Monthly Expense
    const monthlyExpense = currentMonthTransactions
      .filter((tr) => ['expense', 'debit', 'withdraw'].includes(tr.type?.toLowerCase()))
      .reduce((acc, tr) => {
        const amount = Number(tr.amount?.toString().replace(/[^\d.-]/g, '')) || 0;
        return acc + amount;
      }, 0);

    // Avg Fraud Score
    const avgFraudScore =
      transactions.length > 0
        ? (
            transactions.reduce((acc, tr) => acc + (Number(tr.fraudScore) || 0), 0) /
            transactions.length
          ).toFixed(1)
        : '0';

    // Category count
    const categoryCounts = {};
    transactions.forEach((tr) => {
      if (tr.categoryId) {
        categoryCounts[tr.categoryId] = (categoryCounts[tr.categoryId] || 0) + 1;
      }
    });

    // Trending category
    let trendingCategoryId = null;

    if (Object.keys(categoryCounts).length > 0) {
      trendingCategoryId = Object.keys(categoryCounts).reduce((a, b) =>
        categoryCounts[a] > categoryCounts[b] ? a : b
      );
    }

    const trendingCategoryLabel = trendingCategoryId
      ? getTransactionCategoryLabel(
          transactions.find((tr) => tr.categoryId === trendingCategoryId) || {
            categoryId: trendingCategoryId
          }
        )
      : 'N/A';

    return {
      monthlyExpense: monthlyExpense.toFixed(2),
      avgFraudScore,
      trendingCategory: trendingCategoryLabel
    };
  }, [transactions]);

  // ================= FETCH =================
  const fetchTransactions = async () => {
    try {
      const result = await PlayerService.getAllUserTransactionList({
        limit,
        sortOrder: 'desc'
      });

      console.log('API RESULT:', result);

      if (result && result.status === 200) {
        const data = result?.response?.data || [];

        setTransactions(data);

        return {
          status: 200,
          data: data,
          totalRecords: data.length
        };
      }

      return {
        status: result?.status || 500,
        error: result?.error || 'Unknown error'
      };
    } catch (error) {
      console.error('FETCH ERROR:', error);

      return {
        status: 500,
        error: error.message
      };
    }
  };

  // ================= TABLE =================
  const { table, isLoading, tableSettings } = useTable({
    columns,
    fetchData: fetchTransactions,
    dependencies: [limit],
    initialSettings: {
      tableSettings: { pagination: false }
    }
  });

  return (
    <Page title="Fraud Detection Dashboard">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* TITLE */}
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard Overview</h1>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Expense */}
          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Monthly Expense</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-600">₹{metrics.monthlyExpense}</h2>
          </div>

          {/* Fraud Score */}
          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Avg Fraud Score</p>
            <h2 className="mt-2 text-2xl font-bold text-purple-600">{metrics.avgFraudScore}</h2>
          </div>

          {/* Category */}
          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Trending Category</p>
            <h2 className="mt-2 text-xl font-semibold text-orange-500">
              {metrics.trendingCategory}
            </h2>
          </div>

          {/* ADD TRANSACTION BUTTON */}
          <div
            onClick={() => navigate('/dashboards/transactions/create')}
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white shadow-md transition hover:scale-[1.03]">
            <p className="text-sm opacity-80">Quick Action</p>
            <h2 className="mt-2 text-xl font-bold">+ Add Transaction</h2>
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-4 mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border px-3 py-1 text-sm">
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border bg-white p-5 shadow-md">
          <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
        </div>
      </div>
    </Page>
  );
}
