import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { Button, Spinner } from 'components/ui';
import AdminDashboardService from 'services/adminDashboard.service';
import { chartJsToComboRows, chartJsToNameValue } from 'utils/analyticsCharts';
import {
  BarChart,
  Bar,
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

function KpiCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-dark-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-50">{value}</p>
      {sub ? <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">{sub}</p> : null}
    </div>
  );
}

function ChartCard({ title, description, children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-dark-600 dark:bg-dark-800 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TransactionsPerDayChart({ chartJs }) {
  if (!chartJs?.labels?.length) return <p className="text-sm text-gray-500">No data</p>;
  const data = chartJsToNameValue(chartJs);
  const fill = chartJs.datasets?.[0]?.backgroundColor || 'rgba(59, 130, 246, 0.55)';
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function VolumePerDayChart({ chartJs }) {
  if (!chartJs?.labels?.length) return <p className="text-sm text-gray-500">No data</p>;
  const { rows, dataKeys, datasets } = chartJsToComboRows(chartJs);
  const ds = datasets[0];
  const key = dataKeys[0];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        {ds?.fill ? (
          <Area
            type="monotone"
            dataKey={key}
            stroke={ds.borderColor || '#10B981'}
            fill={ds.backgroundColor || 'rgba(16, 185, 129, 0.2)'}
            name={ds.label}
          />
        ) : (
          <Line
            type="monotone"
            dataKey={key}
            stroke={ds?.borderColor || '#10B981'}
            dot={false}
            name={ds?.label}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function FraudTrendsChart({ chartJs }) {
  if (!chartJs?.labels?.length) return <p className="text-sm text-gray-500">No data</p>;
  const { rows, dataKeys, datasets } = chartJsToComboRows(chartJs);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval="preserveStartEnd" height={56} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {datasets.map((ds, i) => {
          const key = dataKeys[i];
          const isBar = Boolean(ds.backgroundColor) && ds.fill !== true;
          if (isBar) {
            return (
              <Bar
                key={key}
                yAxisId="right"
                dataKey={key}
                fill={ds.backgroundColor}
                name={ds.label}
                maxBarSize={28}
              />
            );
          }
          return (
            <Line
              key={key}
              yAxisId="left"
              type="monotone"
              dataKey={key}
              stroke={ds.borderColor || '#DC2626'}
              strokeWidth={2}
              dot={false}
              name={ds.label}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function ActiveUsersChart({ chartJs }) {
  if (!chartJs?.labels?.length) return <p className="text-sm text-gray-500">No data</p>;
  const data = chartJsToNameValue(chartJs);
  const fill = chartJs.datasets?.[0]?.backgroundColor || 'rgba(139, 92, 246, 0.45)';
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-dark-600" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" name={chartJs.datasets?.[0]?.label} radius={[3, 3, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(() => dayjs().format('YYYY-MM-DD'));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminDashboardService.getDashboard({
        startDate: dayjs(startDate).startOf('day').toISOString(),
        endDate: dayjs(endDate).endOf('day').toISOString()
      });
      if (res.status !== 200) {
        toast.error(
          res.error ||
            res.response?.message ||
            res.response?.error ||
            'Failed to load admin dashboard'
        );
        setPayload(null);
        return;
      }
      setPayload(res.response);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load admin dashboard');
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = payload?.kpis;
  const charts = payload?.charts;
  const meta = payload?.meta;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <Button color="primary" className="gap-2" loading={loading} onClick={load}>
          <ArrowPathIcon className="size-4" />
          Refresh data
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
        <p className="text-xs text-gray-500 dark:text-dark-400 sm:ml-auto sm:max-w-md">
          {meta?.description ||
            'KPIs: total users is lifetime; other figures are for the selected range when the API supports it.'}
        </p>
      </div>

      {loading && !payload ? (
        <div className="flex justify-center py-24">
          <Spinner className="size-12 border-2" />
        </div>
      ) : null}

      {kpis ? (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Total users (lifetime)" value={kpis.totalUsers ?? '—'} />
          <KpiCard
            label="Transactions (range)"
            value={kpis.totalTransactions ?? '—'}
            sub="Per API selected window"
          />
          <KpiCard label="Fraud cases" value={kpis.fraudCases ?? '—'} />
          <KpiCard label="High-risk transactions" value={kpis.highRiskTransactions ?? '—'} />
          <KpiCard
            label="Revenue volume (total)"
            value={
              kpis.revenueVolume?.total != null
                ? Number(kpis.revenueVolume.total).toLocaleString()
                : '—'
            }
          />
          <KpiCard
            label="Income"
            value={
              kpis.revenueVolume?.income != null
                ? Number(kpis.revenueVolume.income).toLocaleString()
                : '—'
            }
          />
          <KpiCard
            label="Expense"
            value={
              kpis.revenueVolume?.expense != null
                ? Number(kpis.revenueVolume.expense).toLocaleString()
                : '—'
            }
          />
          <KpiCard
            label="Net"
            value={
              kpis.revenueVolume?.net != null
                ? Number(kpis.revenueVolume.net).toLocaleString()
                : '—'
            }
          />
        </div>
      ) : null}

      {meta?.startDate ? (
        <p className="mb-6 text-xs text-gray-500 dark:text-dark-400">
          API range: {dayjs(meta.startDate).format('MMM D, YYYY')} —{' '}
          {dayjs(meta.endDate).format('MMM D, YYYY')}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Transactions per day"
          description="Daily transaction counts (zeros filled per API).">
          <TransactionsPerDayChart chartJs={charts?.transactionsPerDay} />
        </ChartCard>
        <ChartCard title="Transaction volume per day" description="Sum of amounts per day.">
          <VolumePerDayChart chartJs={charts?.transactionVolumePerDay} />
        </ChartCard>
        <ChartCard
          title="Fraud trends"
          description="Average fraud score, high-risk counts, and new fraud log alerts."
          className="xl:col-span-2">
          <FraudTrendsChart chartJs={charts?.fraudTrends} />
        </ChartCard>
        <ChartCard
          title="Active users"
          description="Distinct users with at least one transaction per day."
          className="xl:col-span-2">
          <ActiveUsersChart chartJs={charts?.activeUsers} />
        </ChartCard>
      </div>
    </main>
  );
}
