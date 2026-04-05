import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import ExpenseTrendChart from 'components/graphs/ExpenseTrendChart';
import CategoryPieChart from 'components/graphs/CategoryPieChart';
import FraudScoreChart from 'components/graphs/FraudScoreChart';
import IncomeExpenseChart from 'components/graphs/IncomeExpenseChart';
import PaymentMethodBarChart from 'components/graphs/PaymentMethodBarChart';
import TransactionCountChart from 'components/graphs/TransactionCountChart';
import { Button, Spinner } from 'components/ui';

import AnalyticsService from 'services/analytics.services';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-dark-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-dark-50">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-400">{sub}</p> : null}
    </div>
  );
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(3, 'month').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(() => dayjs().format('YYYY-MM-DD'));
  const [granularity, setGranularity] = useState('');

  const [incomeExpense, setIncomeExpense] = useState(null);
  const [txAnalytics, setTxAnalytics] = useState(null);
  const [fraudAnalytics, setFraudAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const q = {
      startDate: dayjs(startDate).startOf('day').toISOString(),
      endDate: dayjs(endDate).endOf('day').toISOString(),
      ...(granularity ? { granularity } : {})
    };

    try {
      const [ie, tx, fr, dash] = await Promise.all([
        AnalyticsService.getIncomeVsExpense(q),
        AnalyticsService.getTransactions(q),
        AnalyticsService.getFraud(q),
        AnalyticsService.getDashboard(q)
      ]);

      const failed = [ie, tx, fr, dash].find((r) => r.status !== 200);
      if (failed) {
        toast.error(failed.error || failed.response?.error || 'Failed to load analytics');
      }

      if (ie.status === 200) setIncomeExpense(ie.response);
      else setIncomeExpense(null);
      if (tx.status === 200) setTxAnalytics(tx.response);
      else setTxAnalytics(null);
      if (fr.status === 200) setFraudAnalytics(fr.response);
      else setFraudAnalytics(null);
      if (dash.status === 200) setDashboard(dash.response);
      else setDashboard(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, granularity]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const cards = dashboard?.cards;

  return (
    <div className="w-full px-[--margin-x] pb-10 pt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-50">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-400">
            Charts match your backend{' '}
            <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">/api/v1/analytics</code>{' '}
            payloads.
          </p>
        </div>
        <Button color="primary" className="shrink-0" onClick={loadAll} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-dark-600 dark:bg-dark-800">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-dark-300">
            Start
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-dark-500 dark:bg-dark-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-dark-300">
            End
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-dark-500 dark:bg-dark-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-dark-300">
            Granularity
          </label>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-dark-500 dark:bg-dark-700">
            <option value="">Auto</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {loading && !incomeExpense && !txAnalytics ? (
        <div className="flex justify-center py-20">
          <Spinner className="size-10 border-2" />
        </div>
      ) : null}

      {cards ? (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Transactions" value={cards.transactionCount ?? '—'} />
          <StatCard
            label="Total volume"
            value={cards.totalVolume != null ? Number(cards.totalVolume).toLocaleString() : '—'}
          />
          <StatCard
            label="Net flow"
            value={cards.netFlow != null ? Number(cards.netFlow).toLocaleString() : '—'}
            sub="Income − expense"
          />
          <StatCard
            label="Avg fraud score"
            value={cards.avgFraudScore ?? '—'}
            sub={`Flagged: ${cards.flaggedTransactions ?? 0}`}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IncomeExpenseChart
          comparison={incomeExpense?.comparison}
          overTime={incomeExpense?.overTime}
        />
        <ExpenseTrendChart volumeOverTime={txAnalytics?.volumeOverTime} />
        <CategoryPieChart byCategory={txAnalytics?.byCategory} />
        <PaymentMethodBarChart byPaymentMethod={txAnalytics?.byPaymentMethod} />
        <TransactionCountChart transactionCountOverTime={txAnalytics?.transactionCountOverTime} />
        <FraudScoreChart
          fraudStatusOnTransactions={fraudAnalytics?.fraudStatusOnTransactions}
          fraudScoreOverTime={fraudAnalytics?.fraudScoreOverTime}
          fraudScoreHistogram={fraudAnalytics?.fraudScoreHistogram}
        />
      </div>
    </div>
  );
}
