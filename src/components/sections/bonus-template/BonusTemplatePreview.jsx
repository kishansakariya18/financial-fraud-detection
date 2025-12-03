import PropTypes from 'prop-types';

import { Card } from 'components/ui';
import { useTranslation } from 'react-i18next';
import {
  boostModeOptionsLabel,
  getBonusTypeLabel,
  paymentMethodOptionsLabel,
  wageringBaseOptionsLabel,
  wageringModeOptionsLabel
} from 'app/pages/bonus-template/happer';

const renderList = (items = [], lookup = {}) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '—';
  }

  const labels = items
    .map((item) => {
      if (item === null || item === undefined) return null;
      if (typeof item === 'string' || typeof item === 'number') {
        const value = String(item);
        return lookup[value] || value;
      }
      if (typeof item === 'object') {
        const rawValue =
          item.value ?? item.id ?? item.GameID ?? item.gameId ?? item.name ?? item.label ?? null;
        if (rawValue === null || rawValue === undefined) return null;
        const value = String(rawValue);
        const label = item.label ?? item.name ?? lookup[value] ?? value;
        return label;
      }
      return null;
    })
    .filter(Boolean);

  return labels.length ? labels.join(', ') : '—';
};

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-100">
      {title}
    </h4>
    {children}
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const compactListClasses =
  'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 text-sm';

export function BonusTemplatePreview({ data, lookups }) {
  const { t } = useTranslation();
  const { templateInfo, bonusDetails, rewardDetails, wageringConfig, maxCashoutConfig, gameplay } =
    data;
  return (
    <Card className="sticky top-4 overflow-hidden border border-gray-200 px-5 py-5 shadow-sm dark:border-dark-500">
      <div className="flex flex-col gap-4">
        <Section title={t('template_info')}>
          <dl className={compactListClasses}>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('template_name')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {templateInfo.templateName || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('bonus_type')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {getBonusTypeLabel(templateInfo.bonusType || '_', t)}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('bonus_tags')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {templateInfo.bonusTag?.join(', ') || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">
              {t('expiry_after_issuance_days')}
            </dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {templateInfo.expiryAfterIssuanceDays || '—'}
            </dd>
          </dl>
        </Section>

        <Section title={t('bonus_details')}>
          <dl className={compactListClasses}>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('bonus_name')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.displayTitle || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">
              {t('description') + ` (${t('player_facing')})`}
            </dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.notes || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">
              {t('description') + ` (${t('internal')})`}
            </dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.adminNotes || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">
              {t('display_priority')}
            </dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.displayPriority || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('desktop_image')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.desktopImage?.name || 'Not selected'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('mobile_image')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {bonusDetails.mobileImage?.name || 'Not selected'}
            </dd>
          </dl>
        </Section>

        <Section title="Reward Details">
          {templateInfo.bonusType === 'deposit_boost' && (
            <>
              <dl className={compactListClasses}>
                <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('boost_mode')}</dt>
                <dd className="break-words text-gray-800 dark:text-dark-100">
                  {boostModeOptionsLabel(rewardDetails.boostMode || '_', t)}
                </dd>
                {rewardDetails.boostMode === 'fixed' && (
                  <>
                    <dt className="font-semibold text-gray-900 dark:text-dark-50">
                      {t('boost_percentage')}
                    </dt>
                    <dd className="break-words text-gray-800 dark:text-dark-100">
                      {rewardDetails.boostPercent || '—'}
                    </dd>
                    <dt className="font-semibold text-gray-900 dark:text-dark-50">
                      {t('minimum_deposit')}
                    </dt>
                    <dd className="break-words text-gray-800 dark:text-dark-100">
                      {rewardDetails.minDepositAmount || '—'}
                    </dd>
                  </>
                )}
                {rewardDetails.boostMode === 'variable' && (
                  <>
                    <dt className="font-semibold text-gray-900 dark:text-dark-50">
                      {t('max_bonus_amount')}
                    </dt>
                    <dd className="break-words text-gray-800 dark:text-dark-100">
                      {rewardDetails.maxBonusAmount || '—'}
                    </dd>
                    <dt className="font-semibold text-gray-900 dark:text-dark-50">
                      {t('variable_rules')}
                    </dt>
                    <dd className="text-gray-800 dark:text-dark-100">{''}</dd>
                  </>
                )}
              </dl>
              {rewardDetails.variableRules && rewardDetails.boostMode === 'variable' && (
                <div className="mt-2 overflow-x-auto rounded-md border border-gray-200 dark:border-dark-600">
                  <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-dark-500">
                    <thead className="bg-gray-50 dark:bg-dark-800/60">
                      <tr>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('payment_method')}
                        </th>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('min_deposit')}
                        </th>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('max_deposit')}
                        </th>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('boost_percentage')}
                        </th>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('wagering')}
                        </th>
                        <th className="px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-dark-200">
                          {t('mco')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                      {rewardDetails.variableRules.map((rule, index) => (
                        <tr
                          key={rule.id || `rule-${index}`}
                          className="hover:bg-gray-50 dark:hover:bg-dark-800/40">
                          <td className="px-2 py-1.5 text-gray-800 dark:text-dark-100">
                            {paymentMethodOptionsLabel(rule.paymentMethod, t)}
                          </td>
                          <td className="px-2 py-1.5 text-left tabular-nums text-gray-800 dark:text-dark-100">
                            {rule.rangeFrom}
                          </td>
                          <td className="px-2 py-1.5 text-left tabular-nums text-gray-800 dark:text-dark-100">
                            {rule.rangeTo}
                          </td>
                          <td className="px-2 py-1.5 text-left tabular-nums text-gray-800 dark:text-dark-100">
                            {rule.boostPercent != null ? `${rule.boostPercent}%` : '—'}
                          </td>
                          <td className="px-2 py-1.5 text-left tabular-nums text-gray-800 dark:text-dark-100">
                            {rule.wagering}
                          </td>
                          <td className="px-2 py-1.5 text-left tabular-nums text-gray-800 dark:text-dark-100">
                            {rule.mco}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {templateInfo.bonusType === 'free_chip' && (
            <dl className={compactListClasses}>
              <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('chip_amount')}</dt>
              <dd className="break-words text-gray-800 dark:text-dark-100">
                {rewardDetails.chipAmount || '—'}
              </dd>
            </dl>
          )}
          {templateInfo.bonusType === 'free_spins' && (
            <dl className={compactListClasses}>
              <dt className="font-semibold text-gray-900 dark:text-dark-50">
                {t('free_spins_game')}
              </dt>
              <dd className="break-words text-gray-800 dark:text-dark-100">
                {rewardDetails.selectedGame?.label || '—'}
              </dd>
              <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('spins_count')}</dt>
              <dd className="break-words text-gray-800 dark:text-dark-100">
                {rewardDetails.spinsCount || '—'}
              </dd>
              <dt className="font-semibold text-gray-900 dark:text-dark-50">
                {t('denomination_per_spin')}
              </dt>
              <dd className="break-words text-gray-800 dark:text-dark-100">
                {rewardDetails.denominationPerSpin || '—'}
              </dd>
              <dt className="font-semibold text-gray-900 dark:text-dark-50">
                {t('max_free_spin_winnings')}
              </dt>
              <dd className="break-words text-gray-800 dark:text-dark-100">
                {rewardDetails.maxFreeSpinWinnings || '—'}
              </dd>
            </dl>
          )}
        </Section>

        <Section title="Wagering Configuration">
          <dl className={compactListClasses}>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('wagering_mode')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {wageringModeOptionsLabel(wageringConfig.mode || '_', t)}
            </dd>
            {wageringConfig.mode === 'multiplier' && (
              <>
                <dt className="font-semibold text-gray-900 dark:text-dark-50">
                  {t('wagering_base')}
                </dt>
                <dd className="break-words text-gray-800 dark:text-dark-100">
                  {wageringBaseOptionsLabel(wageringConfig.base || '_', t)}
                </dd>
              </>
            )}
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('wagering_value')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {wageringConfig.wageringValue || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('days_to_wager')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {wageringConfig.daysToWager || '—'}
            </dd>
          </dl>
        </Section>

        <Section title="Max Cashout Configuration">
          <dl className={compactListClasses}>
            <dt className="text-sm font-semibold text-gray-900 dark:text-dark-50">{t('mode')}</dt>
            <dd className="break-words text-sm text-gray-800 dark:text-dark-100">
              {wageringModeOptionsLabel(maxCashoutConfig.mode || '_', t)}
            </dd>
            {maxCashoutConfig.mode === 'multiplier' && (
              <>
                <dt className="text-sm font-semibold text-gray-900 dark:text-dark-50">
                  {t('max_cashout_base')}
                </dt>
                <dd className="break-words text-sm text-gray-800 dark:text-dark-100">
                  {wageringBaseOptionsLabel(maxCashoutConfig.base || '_', t)}
                </dd>
              </>
            )}
            <dt className="text-sm font-semibold text-gray-900 dark:text-dark-50">
              {t('max_cashout')}
            </dt>
            <dd className="break-words text-sm text-gray-800 dark:text-dark-100">
              {maxCashoutConfig.cashoutValue || '—'}
            </dd>
            <dt className="text-sm font-semibold text-gray-900 dark:text-dark-50">
              {t('sticky_bonus')}
            </dt>
            <dd className="break-words text-sm text-gray-800 dark:text-dark-100">
              {maxCashoutConfig.stickyBonus ? 'Yes' : 'No'}
            </dd>
          </dl>
        </Section>

        <Section title="Gameplay Configuration">
          <dl className={compactListClasses}>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('minimum_bet')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {gameplay.minBet || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('maximum_bet')}</dt>
            <dd className="break-words text-gray-800 dark:text-dark-100">
              {gameplay.maxBet || '—'}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('providers')}</dt>
            <dd>
              {gameplay.allowedProviders && gameplay.allowedProviders.length > 0 ? (
                <span>
                  <span className="font-medium">
                    {gameplay.providerIncluded !== false ? 'Include' : 'Exclude'}:{' '}
                  </span>
                  {renderList(gameplay.allowedProviders, lookups.provider)}
                </span>
              ) : (
                '—'
              )}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('categories')}</dt>
            <dd>
              {gameplay.allowedCategories && gameplay.allowedCategories.length > 0 ? (
                <span>
                  <span className="font-medium">
                    {gameplay.categoryIncluded !== false ? 'Include' : 'Exclude'}:{' '}
                  </span>
                  {renderList(gameplay.allowedCategories, lookups.category)}
                </span>
              ) : (
                '—'
              )}
            </dd>
            <dt className="font-semibold text-gray-900 dark:text-dark-50">{t('games')}</dt>
            <dd>
              {gameplay.allowedGames && gameplay.allowedGames.length > 0 ? (
                <span>
                  <span className="font-medium">
                    {gameplay.gameIncluded !== false ? 'Include' : 'Exclude'}:{' '}
                  </span>
                  {renderList(gameplay.allowedGames, lookups.game)}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </dl>
        </Section>
      </div>
    </Card>
  );
}

BonusTemplatePreview.propTypes = {
  data: PropTypes.shape({
    templateInfo: PropTypes.object.isRequired,
    bonusDetails: PropTypes.object.isRequired,
    rewardDetails: PropTypes.object.isRequired,
    wageringConfig: PropTypes.object.isRequired,
    maxCashoutConfig: PropTypes.object.isRequired,
    gameplay: PropTypes.object.isRequired
  }).isRequired,
  lookups: PropTypes.shape({
    bonusType: PropTypes.object,
    wageringMode: PropTypes.object,
    maxCashoutMode: PropTypes.object,
    paymentMethod: PropTypes.object,
    provider: PropTypes.object,
    category: PropTypes.object,
    game: PropTypes.object
  }).isRequired
};
