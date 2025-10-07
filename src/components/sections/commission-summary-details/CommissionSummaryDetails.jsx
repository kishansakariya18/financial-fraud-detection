import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { Page } from 'components/shared/Page';
import { TabNavigation } from './TabNavigation';
import AgentService from 'services/agent.services';
import { TabPanel } from '@headlessui/react';
import { SummaryDetailsCard } from './SummaryDetailsCard';
import CommissionEventsList from '../commission-events/list';
import { mapSingleSummaryData } from '../commission-summary/helper';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export default function CommissionSummaryDetails({ breadcrumbs = null }) {
  const { t } = useTranslation();
  const { agentUID = null, summaryId } = useParams();
  const location = useLocation();

  const [summaryData, setSummaryData] = useState(
    location.state?.summaryData ? location.state.summaryData : null
  );
  const [loading, setLoading] = useState(!summaryData);
  const [error, setError] = useState(null);

  // Fetch summary details if not available from navigation state
  useEffect(() => {
    const fetchSummaryDetails = async () => {
      if (!summaryData && summaryId) {
        setLoading(true);
        setError(null);
        await AgentService.getCommissionSummaryDetails(summaryId)
          .then((result) => {
            setSummaryData(mapSingleSummaryData(result.response.data));
          })
          .catch((err) => {
            setError(err || t('something_went_wrong'));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    fetchSummaryDetails();
  }, [summaryData, summaryId, t]);

  if (loading) {
    return (
      <Page title={t('commission_summary') + ' ' + t('details')}>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-dark-300">{t('loading')}...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title={t('commission_summary') + ' ' + t('details')}>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">{t('error')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">{error}</p>
          </div>
        </div>
      </Page>
    );
  }

  if (!summaryData) {
    return (
      <Page title={t('commission_summary') + ' ' + t('details')}>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100">{t('noData')}</h3>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title={t('commission_summary') + ' ' + t('details')}>
      <div className="w-full px-[--margin-x]">
        <div className={clsx('flex items-center gap-4', 'pt-4')}>
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {t('commission_summary') + ' ' + t('details')}
          </h2>
          {breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
              <div className="hidden self-stretch py-1 sm:flex">
                <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
              </div>
              <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
            </div>
          )}
        </div>
        <div className="card rounded-lg border border-gray-200">
          <TabNavigation summaryData={summaryData} agentUID={agentUID} breadcrumbs={breadcrumbs}>
            <TabPanel id="summary">
              <SummaryDetailsCard summaryData={summaryData} />
            </TabPanel>
            <TabPanel id="events">
              <CommissionEventsList
                agentUID={agentUID}
                summaryData={summaryData}
                breadcrumbs={breadcrumbs}
                hideDateFilter={true}
                hideFilters={true}
                hideEventNameColumn={true}
              />
            </TabPanel>
          </TabNavigation>
        </div>
      </div>
    </Page>
  );
}
