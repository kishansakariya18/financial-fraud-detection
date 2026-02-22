import { DashboardCard } from 'components/custom/DashboardCard';
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

  // Metrics calculation
  const metrics = useMemo(() => {
    if (!transactions.length)
      return { monthlyExpense: 0, avgFraudScore: 0, trendingCategory: 'N/A' };

    const now = dayjs();
    const currentMonthTransactions = transactions.filter((tr) =>
      dayjs(tr.transactionDate).isSame(now, 'month')
    );

    const monthlyExpense = currentMonthTransactions
      .filter((tr) => tr.type === 'EXPENSE')
      .reduce((acc, tr) => acc + (Number(tr.amount) || 0), 0);

    const avgFraudScore =
      transactions.reduce((acc, tr) => acc + (Number(tr.fraudScore) || 0), 0) / transactions.length;

    const categoryCounts = transactions.reduce((acc, tr) => {
      acc[tr.categoryId] = (acc[tr.categoryId] || 0) + 1;
      return acc;
    }, {});

    const trendingCategoryId = Object.keys(categoryCounts).reduce(
      (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
      ''
    );

    const trendingCategoryLabel =
      TRANSACTION_CATEGORIES.find((c) => c.value === trendingCategoryId)?.label ||
      trendingCategoryId ||
      'N/A';

    return {
      monthlyExpense: monthlyExpense.toFixed(2),
      avgFraudScore: avgFraudScore.toFixed(1),
      trendingCategory: trendingCategoryLabel
    };
  }, [transactions]);

  const fetchTransactions = async () => {
    // Fetch a large number of transactions to calculate metrics and show recent ones
    const result = await PlayerService.getAllUserTransactionList({
      limit: 5,
      sortOrder: 'desc'
    });

    if (result?.status === 200) {
      const data = result.response.data || [];
      setTransactions(data);
      // Return only the first 5 for the recent transactions table
      return {
        status: 200,
        data: data.slice(0, 5),
        totalRecords: Math.min(data.length, 5)
      };
    }
    return { status: result?.status, error: result?.error };
  };

  const {
    table,
    isLoading: isTableLoading,
    tableSettings
  } = useTable({
    columns,
    fetchData: fetchTransactions,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { pagination: false } // Disable pagination for the dashboard preview
    }
  });

  return (
    <Page title="Fraud Detection Dashboard">
      <div className="w-full px-[--margin-x] pt-5 lg:pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            label="Monthly Expense"
            value={`$${metrics.monthlyExpense}`}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            textColor="text-blue-100"
          />
          <DashboardCard
            label="Avg Fraud Score"
            value={metrics.avgFraudScore}
            gradientFrom="from-purple-500"
            gradientTo="to-purple-600"
            textColor="text-purple-100"
          />
          <DashboardCard
            label="Trending Category"
            value={metrics.trendingCategory}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            textColor="text-orange-100"
          />
          <DashboardCard
            label="Actions"
            value="New Transaction"
            gradientFrom="from-emerald-500"
            gradientTo="to-emerald-600"
            textColor="text-emerald-100"
            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/transactions/create')}
          />
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-50">
              Recent Transactions
            </h2>
          </div>
          <TableCard tableSettings={tableSettings} table={table} loading={isTableLoading} />
        </div>
      </div>
    </Page>
  );
}
