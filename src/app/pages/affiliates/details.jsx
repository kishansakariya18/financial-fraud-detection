import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import AffiliatesService from 'services/affiliates.services';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Card, Button } from 'components/ui';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export default function AffiliateDetails() {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [summary, setSummary] = useState(null);
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const fetchData = async () => {
    const res = await AffiliatesService.getAffiliateDetail({
      affiliateId
    });
    if (res.status === 200) {
      console.log('log yaha hai', res);
      const apiData = res.response?.data || {};
      const listPayload = Array.isArray(apiData?.data)
        ? apiData.data
        : Array.isArray(apiData)
          ? apiData
          : undefined;
      const item = listPayload?.[0] || apiData;

      const merged = {
        AffiliateUID: item?.affiliates?.AffiliateUID ?? item?.AffiliateUID ?? '-',
        AffiliateID: item?.affiliates?.AffiliateID ?? item?.AffiliateID ?? '-',
        Hits: item?.Hits ?? 0,
        ReferredUsers: item?.ReferredUsers ?? 0,
        FirstTimeDeposits: item?.FirstTimeDeposits ?? 0,
        TotalDeposits: item?.TotalDeposits ?? 0,
        OverallCommission: item?.OverallCommission ?? 0
      };
      setSummary(merged);
      const payload = apiData?.data ?? apiData;
      return { status: 200, data: payload };
    }
    return { status: res.status, error: res.error };
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageTitle = `${t('affiliates')} ${t('details')}`;
  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('affiliate') + ' ' + t('details') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pt-4">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {t('affiliates') + ' ' + t('details')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>

      {summary && (
        <div className="px-[--margin-x]">
          <div className="space-y-6">
            {/* Details Grid - mirrors ViewDetails.jsx layout */}
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    key: 'AffiliateID',
                    label: t('affiliate_id', { defaultValue: 'Affiliate ID' }),
                    value: summary.AffiliateID,
                    copyable: true
                  },
                  {
                    key: 'AffiliateUID',
                    label: t('affiliate_uid', { defaultValue: 'Affiliate UID' }),
                    value: summary.AffiliateUID,
                    copyable: true
                  },
                  {
                    key: 'Hits',
                    label: t('hits', { defaultValue: 'Hits' }),
                    value: summary.Hits
                  },
                  {
                    key: 'ReferredUsers',
                    label: t('referred_users', { defaultValue: 'Referred Users' }),
                    value: summary.ReferredUsers
                  },
                  {
                    key: 'FirstTimeDeposits',
                    label: t('first_time_deposits', { defaultValue: 'First Time Deposits' }),
                    value: summary.FirstTimeDeposits
                  },
                  {
                    key: 'TotalDeposits',
                    label: t('total_deposits', { defaultValue: 'Total Deposits' }),
                    value: summary.TotalDeposits
                  },
                  {
                    key: 'OverallCommission',
                    label: t('overall_commission', { defaultValue: 'Overall Commission' }),
                    value: summary.OverallCommission
                  }
                ].map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {detail.label}
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100">
                      {detail.copyable && detail.value ? (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <span>{`${detail.value}`}</span>
                          <Button
                            data-tooltip
                            data-tooltip-content={copied ? 'Copied' : 'Copy'}
                            onClick={() => copy(String(detail.value))}
                            isIcon
                            variant="flat"
                            className="size-5 rounded-full"
                            aria-label="Copy Button">
                            <DocumentDuplicateIcon className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        `${detail.value}`
                      )}
                    </dd>
                  </div>
                ))}
              </div>
            </Card>

            {/* Placeholder sections to match the "card-like" composition of ViewDetails */}
            <Card className="p-6">
              <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('performance_summary', { defaultValue: 'Performance Summary' })}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {summary.Hits}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('hits', { defaultValue: 'Hits' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {summary.ReferredUsers}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('referred_users', { defaultValue: 'Referred Users' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {summary.OverallCommission}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('overall_commission', { defaultValue: 'Overall Commission' })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
}
