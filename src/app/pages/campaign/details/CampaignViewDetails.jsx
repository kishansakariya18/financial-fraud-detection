import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Card, Button, Skeleton, Badge } from 'components/ui';
import CampaignService from 'services/campaign.service';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { campaignStatusOptions, campaignStatusToAPP } from 'app/pages/campaign/helper';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  GiftIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function CampaignViewDetails({ campaignUID, customBreadcrumbs }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  const breadcrumbs = customBreadcrumbs || [
    { title: t('campaign'), path: '/campaign' },
    { title: t('details') }
  ];

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      const result = await CampaignService.campaignDetail(campaignUID);
      if (result?.status === 200) {
        setCampaign(result.response.data);
      } else {
        toast.error(result?.error || 'Failed to fetch campaign details');
      }
      setLoading(false);
    };

    if (campaignUID) {
      fetchCampaign();
    }
  }, [campaignUID]);

  const getStatusInfo = (statusValue) => {
    // Convert numeric status to string if needed
    const statusString = campaignStatusToAPP(statusValue);
    const status = campaignStatusOptions.find((opt) => opt.value === statusString);
    return status || { label: statusString, color: 'default', icon: null };
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center text-gray-500">
        {t('campaign_not_found') || 'Campaign not found'}
      </div>
    );
  }

  const statusInfo = getStatusInfo(campaign.Status);

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="mb-5 flex items-center gap-2.5 border-b border-gray-200 pb-3 dark:border-dark-600">
      <Icon className="text-primary size-5" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-50">{title}</h3>
    </div>
  );

  const InfoField = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900 dark:text-dark-50">{value || '-'}</div>
    </div>
  );

  return (
    <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
          {t('campaign') + ' ' + t('details')}
        </h2>
        <div className="hidden self-stretch py-1 sm:flex">
          <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
        </div>
        <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
      </div>

      <div className="space-y-5">
        {/* Basics Section */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader icon={TagIcon} title={`1. ${t('basics') || 'Basics'}`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoField label={t('name')} value={campaign.CampaignName} />
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                {t('status')}
              </p>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  statusInfo.color === 'success'
                    ? 'bg-success/10 text-success'
                    : statusInfo.color === 'error'
                      ? 'bg-error/10 text-error'
                      : 'bg-warning/10 text-warning'
                }`}>
                {statusInfo.label}
              </span>
            </div>
            <InfoField
              label={t('start') + ' ' + t('date')}
              value={getDateInUTCToTimeZone(campaign.StartDate)}
            />
            <InfoField
              label={t('end') + ' ' + t('date')}
              value={getDateInUTCToTimeZone(campaign.EndDate)}
            />
            <InfoField label={t('description')} value={campaign.Description} fullWidth />
            <div className="col-span-full">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                {t('tags')}
              </p>
              {campaign.tags && campaign.tags.length > 0 ? (
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-dark-600 dark:bg-dark-800/50">
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-dark-700 dark:text-dark-200 dark:ring-dark-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-900 dark:text-dark-50">–</span>
              )}
            </div>
          </div>
        </Card>

        {/* Targeting Section */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader icon={ChartBarIcon} title={`2. ${t('targeting') || 'Targeting'}`} />
          <div className="grid gap-5 sm:grid-cols-3">
            <InfoField label={t('target') + ' ' + t('segment')} value={campaign.TargetSegmentID} />
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                {t('force') + ' ' + t('include')}
              </p>
              {campaign.IncludedPlayers?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {campaign.IncludedPlayers.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-900 dark:text-dark-50">-</span>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                {t('force') + ' ' + t('exclude')}
              </p>
              {campaign.ExcludedPlayers?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {campaign.ExcludedPlayers.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-900 dark:text-dark-50">-</span>
              )}
            </div>
          </div>
        </Card>

        {/* Triggers Section */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader
            icon={AdjustmentsHorizontalIcon}
            title={`3. ${t('triggers') || 'Triggers'}`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoField
              label="Trigger on Entry"
              value={campaign.TriggerOnEntry ? t('yes') : t('no')}
            />
            <InfoField
              label="Trigger on Exit"
              value={campaign.TriggerOnExit ? t('yes') : t('no')}
            />
            <InfoField
              label="Trigger on Schedule"
              value={campaign.isTriggerOnSchedule ? t('yes') : t('no')}
            />
            {campaign.isTriggerOnSchedule === 1 && (
              <>
                <InfoField
                  label="Schedule Type"
                  value={
                    <span className="capitalize">{campaign.RecurringScheduleType || '-'}</span>
                  }
                />
                <div className="col-span-full">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-400">
                    Schedule Config
                  </p>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-dark-800/50">
                    <pre className="text-xs text-gray-700 dark:text-dark-200">
                      {JSON.stringify(campaign.RecurringScheduleConfig, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Bonus Removal Rules */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader
            icon={CalendarDaysIcon}
            title={`4. ${t('bonus_removal_rules') || 'Bonus Removal Rules'}`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoField
              label="Remove After Time"
              value={campaign.RemoveBonusAfterXTime ? t('yes') : t('no')}
            />
            {campaign.RemoveBonusAfterXTime === 1 && (
              <>
                <InfoField label="Remove After Days" value={campaign.RemoveBonusAfterDays} />
                <InfoField label="Remove After Hours" value={campaign.RemoveBonusAfterHours} />
              </>
            )}
            <InfoField
              label="Remove on Exit Segment"
              value={campaign.RemoveOnExitSegment ? t('yes') : t('no')}
            />
            <InfoField
              label="Remove on Fixed Date"
              value={getDateInUTCToTimeZone(campaign.RemoveOnFixedDate)}
            />
            <InfoField
              label="Max Claims Across Promotions"
              value={campaign.MaxClaimAcrossPromotions}
            />
          </div>
        </Card>

        {/* Re-Issuance Policy */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader
            icon={ArrowPathIcon}
            title={`5. ${t('reissuance_policy') || 'Re-Issuance Policy'}`}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoField
              label="Policy Type"
              value={
                campaign.ReissuePolicyType === 0
                  ? 'One bonus per player at a time'
                  : campaign.ReissuePolicyType === 1
                    ? 'Re-issue even if player has an active one'
                    : 'Allow stacking'
              }
            />
            {campaign.ReissuePolicyType === 2 && (
              <InfoField label="Re-issue Bonus Upto" value={campaign.ReissueBonusUpto} />
            )}
          </div>
        </Card>

        {/* Promotions Section */}
        <Card className="overflow-hidden p-6 shadow-sm">
          <SectionHeader icon={GiftIcon} title={`6. ${t('promotions') || 'Promotions'}`} />
          {campaign.CampaignPromotions && campaign.CampaignPromotions.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {campaign.CampaignPromotions.map((promo, idx) => (
                <div
                  key={promo.CampaignPromotionID || idx}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md dark:border-dark-600 dark:bg-dark-800">
                  <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50/50 p-4 dark:border-dark-700 dark:bg-dark-700/30">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-dark-50">
                        {promo.PromoName}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-400">
                        Template ID: {promo.BonusTemplateID}
                      </p>
                    </div>
                    <Badge variant="outline" color="primary" className="text-xs">
                      Priority {promo.Priority}
                    </Badge>
                  </div>

                  <div className="p-4">
                    {promo.ImageUrl && (
                      <div className="mb-3">
                        <img
                          src={promo.ImageUrl}
                          alt={promo.PromoName}
                          className="h-24 w-full rounded-md object-cover"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-50">
                        {promo.Title}
                      </p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-dark-300">
                        {promo.PromoDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-gray-100 pt-3 text-xs dark:border-dark-700">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Cooldown:</span>
                        <span className="font-semibold text-gray-900 dark:text-dark-100">
                          {promo.CooldownHour}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Daily:</span>
                        <span className="font-semibold text-gray-900 dark:text-dark-100">
                          {promo.MaxClaimPerDay}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Weekly:</span>
                        <span className="font-semibold text-gray-900 dark:text-dark-100">
                          {promo.MaxClaimPerWeek}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Monthly:</span>
                        <span className="font-semibold text-gray-900 dark:text-dark-100">
                          {promo.MaxClaimPerMonth}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-between border-t border-gray-100 pt-2 dark:border-dark-700">
                        <span className="text-gray-500 dark:text-dark-400">Lifetime:</span>
                        <span className="font-semibold text-gray-900 dark:text-dark-100">
                          {promo.MaxClaimLifetime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 dark:border-dark-600">
              <GiftIcon className="mb-2 size-10 text-gray-300 dark:text-dark-500" />
              <p className="text-sm text-gray-500 dark:text-dark-300">
                {t('no_promotions') || 'No promotions found'}
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button className="min-w-[7rem]" onClick={() => navigate('/campaign')}>
            {t('back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
