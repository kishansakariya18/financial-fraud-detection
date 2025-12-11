import { isValidElement, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Badge, Button, Card, Skeleton } from 'components/ui';

import BonusTemplateService from 'services/bonus-template.services';
import {
  getBonusTypeLabel,
  getTemplateStatusLabel,
  normalizeBonusTemplateDetail,
  paymentMethodOptionsLabel,
  wageringBaseOptionsLabel,
  wageringModeOptionsLabel
} from './happer';
import { useTranslation } from 'react-i18next';
import RenderImage from 'components/ui/custom/ImageRender';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const statusColorMap = {
  active: 'success',
  inactive: 'warning',
  archived: 'error',
  unknown: 'neutral'
};

// const formatDateTime = (value) => {
//   if (!value) return null;
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return String(value);
//   return date.toLocaleString();
// };

const formatStatusBadge = (status, color) => (
  <Badge variant="soft" color={color}>
    {status}
  </Badge>
);

const DetailSection = ({ title, rows, children }) => (
  <section className="space-y-3">
    <h3 className="font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
      {title}
    </h3>
    <div className="rounded-lg bg-slate-50 p-4">
      {Array.isArray(rows) && rows.length > 0 && <KeyValueGrid rows={rows} />}
      {children}
    </div>
  </section>
);

const KeyValueGrid = ({ rows }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {rows.map(({ label, value }) => (
      <div key={label} className="space-y-1">
        <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">{label}</div>
        <div className="text-sm text-gray-900 dark:text-dark-50">{renderValue(value)}</div>
      </div>
    ))}
  </div>
);

const renderValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-500 dark:text-dark-200">—</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-gray-500 dark:text-dark-200">—</span>;
    }
    return value.join(', ');
  }

  if (isValidElement(value)) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object') {
    return (
      <pre className="whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs dark:bg-dark-700/60">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return value;
};

export default function ViewBonusTemplate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [templateDetail, setTemplateDetail] = useState(null);

  const renderVariableRules = (variableRules) => {
    if (!variableRules || variableRules.length === 0) return '—';
    return (
      <table className="min-w-full divide-y divide-gray-200 text-tiny dark:divide-dark-500">
        <thead className="bg-gray-50 dark:bg-dark-700/40">
          <tr className="text-left text-gray-600 dark:text-dark-200">
            <th>{t('payment_method')}</th>
            <th>{t('range_from')}</th>
            <th>{t('range_to')}</th>
            <th>{t('boost_percentage')}</th>
            <th>{t('wagering')}</th>
            <th>{t('mco')}</th>
          </tr>
        </thead>
        <tbody>
          {variableRules.map((rule) => (
            <tr className="text-left text-gray-600 dark:text-dark-200" key={rule.id}>
              <td>{paymentMethodOptionsLabel(rule.paymentMethod, t)}</td>
              <td>{rule.rangeFrom}</td>
              <td>{rule.rangeTo}</td>
              <td>{rule.boostPercent}</td>
              <td>{rule.wagering}</td>
              <td>{rule.mco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        toast.error('Template ID is missing');
        navigate('/bonus/templates');
        return;
      }

      try {
        const result = await BonusTemplateService.getTemplateById(templateId);
        if (result.status === 200) {
          setTemplateDetail(result.response?.data ?? result.response ?? null);
        } else {
          toast.error(result.error || 'Unable to load bonus template');
          navigate('/bonus/templates');
        }
      } catch (error) {
        toast.error(error?.message || 'Unable to load bonus template');
        navigate('/bonus/templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [navigate, templateId]);

  const normalized = useMemo(() => {
    const base = normalizeBonusTemplateDetail(templateDetail);
    if (!base) return {};
    return {
      ...base,
      statusColor: statusColorMap[base.status] || statusColorMap.unknown
    };
  }, [templateDetail]);

  const statusBadge = normalized
    ? formatStatusBadge(getTemplateStatusLabel(normalized.status, t), normalized.statusColor)
    : null;

  console.log('normalized.bonusDetails: ', normalized.bonusDetails);
  return (
    <ContentWrapper pageTitle="Bonus Template Details">
      <div className="mx-[--margin-x] mt-4 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outlined"
            color="neutral"
            onClick={() => navigate('/bonus/templates')}>
            Back to Templates
          </Button>
        </div>

        {isLoading ? (
          <Card className="space-y-4 px-6 py-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ) : !normalized ? (
          <Card className="px-6 py-6">
            <div className="text-sm text-gray-600 dark:text-dark-200">
              Unable to display bonus template details.
            </div>
          </Card>
        ) : (
          <Card className="space-y-8 px-6 py-6">
            <header className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
                  {normalized.templateInfo.templateName}
                </h2>
                {normalized.templateInfo.bonusType && (
                  <Badge variant="soft" color="info">
                    {getBonusTypeLabel(normalized.templateInfo.bonusType, t)}
                  </Badge>
                )}
              </div>
              {normalized.bonusDetails.displayTitle && (
                <p className="text-sm text-gray-600 dark:text-dark-200">
                  Display Title: {normalized.bonusDetails.displayTitle}
                </p>
              )}
            </header>

            <DetailSection
              title="Template Information"
              rows={[
                {
                  label: 'Template ID',
                  value: (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{normalized.rowData.BonusTemplateID || '—'}</span>
                      {statusBadge}
                    </div>
                  )
                },
                {
                  label: t('bonus_type'),
                  value: getBonusTypeLabel(normalized.templateInfo.bonusType, t) || '—'
                },
                {
                  label: t('display_priority'),
                  value: normalized.bonusDetails.displayPriority ?? '—'
                },
                {
                  label: t('expiry_after_issuance_days'),
                  value: normalized.templateInfo.expiryAfterIssuanceDays ?? '—'
                },
                {
                  label: t('description') + ` (${t('player_facing')})`,
                  value: normalized.bonusDetails.notes || '—'
                },
                {
                  label: t('bonus_tags'),
                  value: normalized.templateInfo.bonusTag?.join(', ') || '—'
                },
                { label: t('created_by'), value: normalized.createdByAdmin.name ?? '—' },
                { label: t('updated_by'), value: normalized.updatedByAdmin.name ?? '—' },
                {
                  label: t('created_at'),
                  value: getDateInUTCToTimeZone(normalized.createdAt) ?? '—'
                },
                {
                  label: t('desktop_image'),
                  value: normalized.bonusDetails.desktopImageUrl ? (
                    // <img
                    //   src={normalized.bonusDetails.desktopImageUrl}
                    //   alt={''}
                    //   className="h-full w-full object-cover"
                    //   style={{
                    //     maxWidth: '100px',
                    //     maxHeight: '100px'
                    //   }}
                    //   // onError={(e) => {
                    //   //   e.target.src = '/images/default-image.png';
                    //   // }}
                    //   // onLoad={(e) => {
                    //   //   e.target.style.display = 'block';
                    //   // }}
                    // />
                    <RenderImage
                      value={normalized.bonusDetails.desktopImageUrl}
                      alt={t('desktop_image')}
                      maxWidth="100px"
                      maxHeight="100px"
                      enableModal={true}
                      // onError={(e) => {
                      //   e.target.src = '/images/default-image.png';
                      // }}
                      // onLoad={(e) => {
                      //   e.target.style.display = 'block';
                      // }}
                    />
                  ) : (
                    'Not uploaded'
                  )
                },
                {
                  label: t('mobile_image'),
                  value: normalized.bonusDetails.mobileImageUrl ? (
                    <RenderImage
                      value={normalized.bonusDetails.mobileImageUrl}
                      alt={t('mobile_image')}
                      maxWidth="100px"
                      maxHeight="100px"
                      enableModal={true}
                    />
                  ) : (
                    'Not uploaded'
                  )
                }
              ]}
            />

            <DetailSection
              title="Reward Configuration"
              rows={[
                ...(normalized.templateInfo?.bonusType === 'deposit_boost'
                  ? [
                      {
                        label: t('boost_mode'),
                        value: normalized.rewardDetails?.boostMode || '—'
                      },
                      ...(normalized.rewardDetails?.boostMode === 'fixed'
                        ? [
                            {
                              label: t('boost_percentage'),
                              value: normalized.rewardDetails?.boostPercent ?? '—'
                            },
                            {
                              label: t('minimum_deposit'),
                              value: normalized.rewardDetails?.minDepositAmount ?? '—'
                            }
                          ]
                        : [
                            {
                              label: t('max_bonus_amount'),
                              value: normalized.rewardDetails?.maxBonusAmount ?? '—'
                            },
                            {
                              label: t('variable_rules'),
                              value: renderVariableRules(normalized.rewardDetails?.variableRules)
                            }
                          ])
                    ]
                  : []),

                ...(normalized.templateInfo?.bonusType === 'free_chip'
                  ? [
                      {
                        label: t('chip_amount'),
                        value: normalized.rewardDetails?.amount ?? '—'
                      }
                    ]
                  : []),
                ...(normalized.templateInfo?.bonusType === 'free_spins'
                  ? [
                      {
                        label: t('free_spins_game'),
                        value: normalized.rewardDetails?.gameId
                          ? `${normalized.rewardDetails?.gameName}`
                          : '—'
                      },
                      {
                        label: t('spins_count'),
                        value: normalized.rewardDetails?.spinsCount ?? '—'
                      },
                      {
                        label: t('denomination_per_spin'),
                        value: normalized.rewardDetails?.denominationPerSpin ?? '—'
                      },
                      {
                        label: t('max_free_spin_winnings'),
                        value: normalized.rewardDetails?.maxFreeSpinWinnings ?? '—'
                      }
                    ]
                  : [])
              ]}
            />

            <DetailSection
              title={t('wagering_configuration')}
              rows={[
                {
                  label: t('mode'),
                  value: wageringModeOptionsLabel(normalized.wageringConfig.mode, t) || '—'
                },
                {
                  label: t('base'),
                  value: wageringBaseOptionsLabel(normalized.wageringConfig.base, t) || '—'
                },
                { label: t('value'), value: normalized.wageringConfig.wageringValue ?? '—' },
                { label: t('days_to_wager'), value: normalized.wageringConfig.daysToWager ?? '—' }
              ]}
            />

            <DetailSection
              title={t('max_cashout_configuration')}
              rows={[
                {
                  label: t('mode'),
                  value: wageringModeOptionsLabel(normalized.maxCashoutConfig.mode, t) || '—'
                },
                {
                  label: t('base'),
                  value: wageringBaseOptionsLabel(normalized.maxCashoutConfig.base, t) || '—'
                },
                {
                  label: t('cashout_value'),
                  value: normalized.maxCashoutConfig.cashoutValue ?? '—'
                },
                {
                  label: t('sticky_bonus'),
                  value: normalized.maxCashoutConfig.stickyBonus ? 'Yes' : 'No'
                }
              ]}
            />

            <DetailSection
              title={t('gameplay_configuration')}
              rows={[
                { label: t('minimum_bet'), value: normalized.gameplay.minBet ?? '—' },
                { label: t('maximum_bet'), value: normalized.gameplay.maxBet ?? '—' },
                {
                  label: t('providers'),
                  value:
                    normalized.gameplay.allowedProviders.length > 0
                      ? `${normalized.gameplay.providerIncluded ? 'Included' : 'Excluded'}: ${normalized.gameplay.allowedProviders.map((provider) => provider.label).join(', ')}`
                      : '—'
                },
                {
                  label: t('categories'),
                  value:
                    normalized.gameplay.allowedCategories.length > 0
                      ? `${normalized.gameplay.categoryIncluded ? 'Included' : 'Excluded'}: ${normalized.gameplay.allowedCategories.map((category) => category.label).join(', ')}`
                      : '—'
                },
                {
                  label: t('games'),
                  value:
                    normalized.gameplay.allowedGames.length > 0
                      ? `${normalized.gameplay.gameIncluded ? 'Included' : 'Excluded'}: ${normalized.gameplay.allowedGames.map((game) => game.label).join(', ')}`
                      : '—'
                }
              ]}
            />
          </Card>
        )}
      </div>
    </ContentWrapper>
  );
}
