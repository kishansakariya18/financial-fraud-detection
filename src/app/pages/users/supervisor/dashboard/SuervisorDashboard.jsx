import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { DashboardCard } from 'components/custom/DashboardCard';
import { Page } from 'components/shared/Page';
import { Button, Card } from 'components/ui';
import { DatePicker } from 'components/shared/form/Datepicker';
import { useLocaleContext } from 'app/contexts/locale/context';
import SupervisorService from 'services/supervisor.services';
import PendingRedeemRequestsList from './pending-redeem-requests/list';
import ApprovedCommissionList from './approved-commission-list/list';

const SupervisorDashboard = () => {
  const { t } = useTranslation();
  const { locale } = useLocaleContext();
  const pageTitle = t('supervisor_dashboard');

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for filters
  const [dateFilters, setDateFilters] = useState({
    startDate: dayjs().locale(locale).subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().locale(locale).format('YYYY-MM-DD')
  });
  const [dateFilterApplied, setDateFilterApplied] = useState(false);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        ...(dateFilterApplied && {
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate
        })
      };

      const result = await SupervisorService.getDashboard(params);

      if (result.status === 200) {
        setDashboardData(result.response.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching supervisor dashboard:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (data) => {
    setDateFilters({ startDate: data[0], endDate: data[1] });
  };

  const onApplyFilters = () => {
    setDateFilterApplied(true);
    fetchDashboard();
  };

  const onResetFilters = () => {
    setDateFilters({
      startDate: dayjs().locale(locale).subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: dayjs().locale(locale).format('YYYY-MM-DD')
    });
    setDateFilterApplied(false);
  };
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full px-[--margin-x] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DashboardCard
              label={`${t('total')} ${t('active')} ${t('agents')}`}
              value={dashboardData?.summary?.agents?.active?.toString() || '0'}
              gradientFrom="from-info"
              gradientTo="to-info-darker"
              textColor="text-sky-100"
              maskShape="is-reuleaux-triangle"
            />
            <DashboardCard
              label={`${t('total')} ${t('inactive')} ${t('agents')}`}
              value={dashboardData?.summary?.agents?.inactive?.toString() || '0'}
              gradientFrom="from-amber-400"
              gradientTo="to-orange-600"
              textColor="text-amber-50"
              maskShape="is-diamond"
            />
            <DashboardCard
              label={`${t('pending')} ${t('redeem')} ${t('requests')}`}
              value={
                dashboardData?.summary?.redeemRequests?.totalPendingRequests?.toString() || '0'
              }
              gradientFrom="from-pink-500"
              gradientTo="to-rose-500"
              textColor="text-pink-100"
              maskShape="is-hexagon-2"
            />
          </div>

          {/* Filter Section */}
          <div className="mt-6 flex w-full flex-wrap items-center gap-2">
            <DatePicker
              onChange={onDateChange}
              className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px]"
              options={{
                mode: 'range',
                dateFormat: 'Y-m-d',
                defaultDate: [dateFilters?.startDate, dateFilters?.endDate]
              }}
              placeholder="Choose date range..."
            />
            <Button
              type="submit"
              color="primary"
              className="rounded px-4 py-2 font-semibold text-white"
              onClick={onApplyFilters}
              disabled={isLoading}>
              {t('apply')}
            </Button>

            <Button
              type="submit"
              color="warning"
              className="rounded px-4 py-2 font-semibold text-white"
              onClick={onResetFilters}
              disabled={isLoading}>
              {t('reset')}
            </Button>
          </div>

          {/* Tables Section */}
          <div className="-mx-2 flex flex-wrap pt-6">
            {/* Pending Redeem Requests Table */}
            <div className="mb-4 w-full px-2">
              <Card className="p-4">
                <PendingRedeemRequestsList
                  data={dashboardData?.lists?.pendingRedeemRequests || []}
                  loading={isLoading}
                />
              </Card>
            </div>

            {/* Approved Commission List Table */}
            <div className="mb-4 w-full px-2">
              <Card className="p-4">
                <ApprovedCommissionList
                  data={dashboardData?.lists?.recentCommissions || []}
                  loading={isLoading}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SupervisorDashboard;
