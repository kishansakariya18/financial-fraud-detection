// Import Dependencies
import { Page } from 'components/shared/Page';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useEffect, useState } from 'react';
import { Card, GhostSpinner } from 'components/ui';
import { Button } from '@headlessui/react';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { parseAgentStatusToApp, parseAgentTypeToApp } from 'components/sections/b2b-agents/helper';
import PropTypes from 'prop-types';
import { useCurrencyContext } from 'app/contexts/currency/context';

const AgentView = ({
  onFetchAgentDetails,
  breadcrumbItem,
  pageTitle = 'Agent',
  showAgentType = true
}) => {
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const [error, setError] = useState('');
  const { formatCurrency } = useCurrencyContext();

  const getAgentDetails = () => {
    if (!onFetchAgentDetails) {
      setError('Fetch function not provided');
      return;
    }

    setLoading(true);
    onFetchAgentDetails(agentUID)
      .then((response) => {
        setAgentDetails(response.response?.data || response.data);
      })
      .catch((err) => {
        setError(err.message || err || 'Failed to fetch agent details');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAgentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentUID]);

  const Loader = (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-32 items-center justify-center">
        <GhostSpinner className="size-8 border-2" />
      </div>
    </Card>
  );

  const Error = (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-32 items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    </Card>
  );

  const NoData = (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-32 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('noData')}</p>
      </div>
    </Card>
  );

  const AgentDetailsCard = (
    <Card className="h-full p-4 sm:p-5">
      <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
        {t('agent') + ' ' + t('details')}:
      </h6>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('agentUid')}:</p>
          <p>{agentDetails?.AgentUID}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('userName')}:</p>
          <p>{agentDetails?.Username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('firstName')}:</p>
          <p>{agentDetails?.FirstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('lastName')}:</p>
          <p>{agentDetails?.LastName}</p>
        </div>
        {showAgentType && (
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('Agent Type')}:
            </p>
            <p>{parseAgentTypeToApp(agentDetails?.AgentType)}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('createdBy')}:</p>
          <p>{agentDetails?.CreatedByAdmin}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('email')}</p>
          <div className="flex space-x-1 rtl:space-x-reverse">
            <span> {agentDetails?.Email || '-'}</span>
            {agentDetails?.Email && (
              <Button
                data-tooltip
                data-tooltip-content={copied ? 'Copied' : 'Copy'}
                onClick={() => copy(agentDetails?.Email)}
                isIcon
                variant="flat"
                className="size-5 rounded-full group-hover/td:opacity-100"
                aria-label="Copy Button">
                <DocumentDuplicateIcon className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('mobile')}:</p>
          <span>
            {agentDetails?.dialCode || '+91'} {agentDetails?.Mobile}
          </span>
          {agentDetails?.Mobile && (
            <Button
              data-tooltip
              data-tooltip-content={copied ? 'Copied' : 'Copy'}
              onClick={() => copy(agentDetails?.Mobile)}
              isIcon
              variant="flat"
              className="size-5 rounded-full group-hover/td:opacity-100"
              aria-label="Copy Button">
              <DocumentDuplicateIcon className="size-3.5" />
            </Button>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('status')}:</p>
          <p>
            {+agentDetails?.AccountStatus >= 0 &&
              capitalizeFirstLetter(parseAgentStatusToApp(agentDetails?.AccountStatus))}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('createdAt')}:</p>
          <p>{getDateInUTCToTimeZone(agentDetails?.DateCreated)}</p>
        </div>
        {agentDetails?.CommissionPercent !== undefined && (
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('commission')}:
            </p>
            <p>{agentDetails?.CommissionPercent}%</p>
          </div>
        )}
      </div>

      {/* Commission Settings Section */}
      {agentDetails?.CommissionSettings && agentDetails.CommissionSettings.length > 0 && (
        <div className="mt-6">
          <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('commission')} {t('settings')}:
          </h6>
          <div className="mt-4 space-y-4">
            {agentDetails.CommissionSettings.map((commission, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-dark-500 dark:bg-dark-800/50">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('type')}:
                    </p>
                    <p className="font-medium capitalize">{commission.CommissionType}</p>
                  </div>

                  {commission.CommissionType === 'turnover' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                          {t('percentage')}:
                        </p>
                        <p className="font-medium">{commission.TurnoverPercent || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                          {t('target')} {t('amount')}:
                        </p>
                        <p className="font-medium">
                          {formatCurrency(commission.TurnoverTargetAmount || 0)}
                        </p>
                      </div>
                    </>
                  )}

                  {commission.CommissionType === 'cpa' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                          CPA {t('amount')}:
                        </p>
                        <p className="font-medium">
                          {formatCurrency(commission.CpaPayoutAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                          {t('trigger')}:
                        </p>
                        <p className="font-medium capitalize">{commission.CpaTrigger}</p>
                      </div>
                      {Number(commission.CpaDepositMinAmount) > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            Min {t('deposit')}:
                          </p>
                          <p className="font-medium">
                            {formatCurrency(commission.CpaDepositMinAmount || 0)}
                          </p>
                        </div>
                      )}
                      {Number(commission.CpaBetMinAmount) > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            Min {t('bet')}:
                          </p>
                          <p className="font-medium">
                            {formatCurrency(commission.CpaBetMinAmount || 0)}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  let content = null;
  if (loading) {
    content = Loader;
  } else if (error) {
    content = Error;
  } else if (!agentDetails) {
    content = NoData;
  } else {
    content = AgentDetailsCard;
  }

  return (
    <Page title={(t('view') || 'View') + ' ' + pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('view') + ' ' + pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">{content}</div>
      </div>
    </Page>
  );
};

AgentView.propTypes = {
  onFetchAgentDetails: PropTypes.func.isRequired,
  breadcrumbItem: PropTypes.array,
  pageTitle: PropTypes.string,
  showAgentType: PropTypes.bool
};

export default AgentView;
