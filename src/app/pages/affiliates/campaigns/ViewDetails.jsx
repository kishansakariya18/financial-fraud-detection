// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import AffiliatesService from 'services/affiliates.services';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Card, Button } from 'components/ui';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export function ViewDetails() {
  const { t } = useTranslation();
  const { campaignUID } = useParams();
  const pageTitle = t('campaign') + ' ' + t('details');
  const { affiliateId } = useParams();
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await AffiliatesService.getCampaignDetail({
        campaignUID
      });

      // Normalize various possible response envelopes
      const raw =
        res?.response?.data?.data ??
        res?.response?.data ??
        res?.data?.data ??
        res?.data ??
        res?.payload ??
        res;

      const data = raw?.data ?? raw; // handle when raw itself is the data object

      if (res.status === 200 && data) {
        const stats = data?.campaignStats ?? {};
        const normalized = {
          CampaignID: data?.CampaignID ?? '-',
          AffiliateID: data?.AffiliateID ?? '-',
          CampaignName: data?.CampaignName ?? '-',
          DateCreated: data?.DateCreated ?? '-',
          CampaignCode: data?.CampaignCode ?? '-',
          CampaignLink: data?.CampaignLink ?? '-',
          Hits: stats?.Hits ?? 0,
          ReferredUsers: stats?.ReferredUsers ?? 0,
          FirstTimeDeposits: stats?.FirstTimeDeposits ?? 0,
          TotalDeposits: stats?.TotalDeposits ?? 0,
          OverallCommission: stats?.OverallCommission ?? 0,
          DateUpdated: stats?.DateUpdated ?? '-'
        };
        setCampaign(normalized);
      } else {
        setError(res?.message || 'Failed to fetch campaign details');
      }
    } catch (e) {
      setError(e?.message || 'Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateId]);
  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('campaign') + ' ' + t('list'), path: `/affiliates/${affiliateId}/tab/campaigns` },
    { title: t('campaign') + ' ' + t('details') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pt-4">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="px-[--margin-x]">
          <Card className="p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('loading', { defaultValue: 'Loading...' })}
            </div>
          </Card>
        </div>
      )}
      {error && !loading && (
        <div className="px-[--margin-x]">
          <Card className="p-6">
            <div className="text-sm text-red-600 dark:text-red-400">{String(error)}</div>
          </Card>
        </div>
      )}

      {campaign && !loading && !error && (
        <div className="px-[--margin-x]">
          <div className="space-y-6">
            {/* Details Grid - mirrors affiliates/details.jsx layout */}
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    key: 'CampaignID',
                    label: t('campaign_id', { defaultValue: 'Campaign ID' }),
                    value: campaign.CampaignID,
                    copyable: true
                  },
                  {
                    key: 'AffiliateID',
                    label: t('affiliate_id', { defaultValue: 'Affiliate ID' }),
                    value: campaign.AffiliateID,
                    copyable: true
                  },
                  {
                    key: 'CampaignName',
                    label: t('campaign_name', { defaultValue: 'Campaign Name' }),
                    value: campaign.CampaignName
                  },
                  {
                    key: 'CampaignCode',
                    label: t('campaign_code', { defaultValue: 'Campaign Code' }),
                    value: campaign.CampaignCode,
                    copyable: true
                  },
                  {
                    key: 'CampaignLink',
                    label: t('campaign_link', { defaultValue: 'Campaign Link' }),
                    value: campaign.CampaignLink,
                    copyable: true
                  },
                  {
                    key: 'DateCreated',
                    label: t('date_created', { defaultValue: 'Date Created' }),
                    value: campaign.DateCreated
                  },
                  {
                    key: 'DateUpdated',
                    label: t('date_updated', { defaultValue: 'Date Updated' }),
                    value: campaign.DateUpdated
                  }
                ].map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {detail.label}
                    </dt>
                    <dd className="break-all text-sm text-gray-900 dark:text-gray-100">
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

            {/* Performance Summary */}
            <Card className="p-6">
              <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('performance_summary', { defaultValue: 'Performance Summary' })}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {campaign.Hits}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('hits', { defaultValue: 'Hits' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {campaign.ReferredUsers}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('referred_users', { defaultValue: 'Referred Users' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {campaign.OverallCommission}
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

export default ViewDetails;
