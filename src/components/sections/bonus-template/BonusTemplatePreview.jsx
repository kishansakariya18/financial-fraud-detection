import PropTypes from 'prop-types';

import { Card } from 'components/ui';
import { useTranslation } from 'react-i18next';

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
    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
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
  'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-dark-100';

export function BonusTemplatePreview({ data, lookups }) {
  const { t } = useTranslation();
  const { templateInfo, bonusDetails, rewardDetails, wageringConfig, maxCashoutConfig, gameplay } =
    data;

  const bonusTypeLabel = lookups.bonusType[templateInfo.bonusType] || templateInfo.bonusType || '—';
  const boostModeLabel = rewardDetails.boostMode
    ? rewardDetails.boostMode.charAt(0).toUpperCase() + rewardDetails.boostMode.slice(1)
    : '—';
  const wageringModeLabel = lookups.wageringMode[wageringConfig.mode] || wageringConfig.mode || '—';
  const maxCashoutModeLabel =
    lookups.maxCashoutMode[maxCashoutConfig.mode] || maxCashoutConfig.mode || '—';

  return (
    <Card className="sticky top-4 overflow-hidden border border-gray-200 px-5 py-5 shadow-sm dark:border-dark-500">
      <div className="flex flex-col gap-4">
        <Section title={t('template_info')}>
          <dl className={compactListClasses}>
            <dt>{t('template_name')}</dt>
            <dd className="font-medium text-gray-900 dark:text-dark-50">
              {templateInfo.templateName || '—'}
            </dd>
            <dt>{t('bonus_type')}</dt>
            <dd className="font-medium text-gray-900 dark:text-dark-50">{bonusTypeLabel}</dd>
            <dt>{t('bonus_tags')}</dt>
            <dd className="font-medium text-gray-900 dark:text-dark-50">
              {templateInfo.bonusTag?.join(', ') || '—'}
            </dd>
            <dt>{t('expiry_after_issuance_days')}</dt>
            <dd className="font-medium text-gray-900 dark:text-dark-50">
              {templateInfo.expiryAfterIssuanceDays || '—'}
            </dd>
          </dl>
        </Section>

        <Section title={t('bonus_details')}>
          <dl className={compactListClasses}>
            <dt>{t('display_title')}</dt>
            <dd className="font-medium text-gray-900 dark:text-dark-50">
              {bonusDetails.displayTitle || '—'}
            </dd>
            <dt>{t('description')}</dt>
            <dd className="overflow-hidden rounded bg-gray-100 px-2 py-1 text-xs leading-5 text-gray-600 dark:bg-dark-700/60 dark:text-dark-200">
              {bonusDetails.description || 'No player-facing description added'}
            </dd>
            <dt>{t('display_priority')}</dt>
            <dd>{bonusDetails.displayPriority || '—'}</dd>
            <dt>{t('desktop_image')}</dt>
            <dd>{bonusDetails.desktopImage?.name || 'Not selected'}</dd>
            <dt>{t('mobile_image')}</dt>
            <dd>{bonusDetails.mobileImage?.name || 'Not selected'}</dd>
          </dl>
        </Section>

        <Section title="Reward Details">
          {templateInfo.bonusType === 'deposit_boost' && (
            <dl className={compactListClasses}>
              <dt>{t('boost_mode')}</dt>
              <dd>{boostModeLabel}</dd>
              {rewardDetails.boostMode === 'fixed' && (
                <>
                  <dt>{t('boost_percentage')}</dt>
                  <dd>{rewardDetails.boostPercent || '—'}</dd>
                  <dt>{t('minimum_deposit')}</dt>
                  <dd>{rewardDetails.minDepositAmount || '—'}</dd>
                </>
              )}
              {rewardDetails.boostMode === 'variable' && (
                <>
                  <dt>{t('max_bonus_amount')}</dt>
                  <dd>{rewardDetails.maxBonusAmount || '—'}</dd>
                  {rewardDetails.variableRules && rewardDetails.variableRules.length > 0 && (
                    <>
                      <dt>{t('variable_rules')}</dt>
                      <dd>
                        {rewardDetails.variableRules.map((rule) => (
                          <li
                            key={rule.id}
                            className="rounded bg-gray-100 px-2 py-1 dark:bg-dark-700/60">
                            {t('payment_method')}: {rule.paymentMethod} · {t('min_deposit')}:{' '}
                            {rule.rangeFrom || '—'} - {rule.rangeTo || '—'} ·{' '}
                            {t('boost_percentage')}: {rule.boostPercent || '—'}% · {t('wagering')}:{' '}
                            {rule.wagering || '—'} · {t('mco')}: {rule.mco || '—'}
                          </li>
                        ))}
                      </dd>
                    </>
                  )}
                </>
              )}
            </dl>
          )}
          {templateInfo.bonusType === 'free_chip' && (
            <dl className={compactListClasses}>
              <dt>{t('chip_amount')}</dt>
              <dd>{rewardDetails.chipAmount || '—'}</dd>
            </dl>
          )}
          {templateInfo.bonusType === 'free_spins' && (
            <dl className={compactListClasses}>
              <dt>{t('free_spins_game')}</dt>
              <dd>{rewardDetails.selectedGame?.label || '—'}</dd>
              <dt>{t('spins_count')}</dt>
              <dd>{rewardDetails.spinsCount || '—'}</dd>
              <dt>{t('denomination_per_spin')}</dt>
              <dd>{rewardDetails.denominationPerSpin || '—'}</dd>
              <dt>{t('max_free_spin_winnings')}</dt>
              <dd>{rewardDetails.maxFreeSpinWinnings || '—'}</dd>
            </dl>
          )}
        </Section>

        <Section title="Wagering Configuration">
          <dl className={compactListClasses}>
            <dt>{t('wagering_mode')}</dt>
            <dd>{wageringModeLabel}</dd>
            <dt>{t('wagering_value')}</dt>
            <dd>{wageringConfig.wageringValue || '—'}</dd>
            <dt>{t('days_to_wager')}</dt>
            <dd>{wageringConfig.daysToWager || '—'}</dd>
          </dl>
        </Section>

        <Section title="Max Cashout Configuration">
          <dl className={compactListClasses}>
            <dt>{t('mode')}</dt>
            <dd>{maxCashoutModeLabel}</dd>
            <dt>{t('max_cashout')}</dt>
            <dd>{maxCashoutConfig.maxCashoutValue || '—'}</dd>
            <dt>{t('sticky_bonus')}</dt>
            <dd>{maxCashoutConfig.stickyBonus ? 'Yes' : 'No'}</dd>
            {/* <dt>{t('variable_rules')}</dt>
            <dd>
              {maxCashoutConfig?.variableRules?.length === 0 ? (
                <span className="text-gray-500 dark:text-dark-200">{t('no_rules_defined')}</span>
              ) : (
                <ul className="space-y-1 text-xs text-gray-600 dark:text-dark-200">
                  {(maxCashoutConfig?.variableRules || []).map((rule) => (
                    <li key={rule.id} className="rounded bg-gray-100 px-2 py-1 dark:bg-dark-700/60">
                      {lookups.paymentMethod[rule.paymentMethod] || rule.paymentMethod} · Deposit{' '}
                      {rule.minDeposit || '—'} - {rule.maxDeposit || '—'} · Boost{' '}
                      {rule.boostPercent || '—'}% · Wager {rule.wagering || '—'} · Cashout{' '}
                      {rule.maxCashout || '—'}
                    </li>
                  ))}
                </ul>
              )}
            </dd> */}
          </dl>
        </Section>

        <Section title="Gameplay Configuration">
          <dl className={compactListClasses}>
            <dt>{t('minimum_bet')}</dt>
            <dd>{gameplay.minBet || '—'}</dd>
            <dt>{t('maximum_bet')}</dt>
            <dd>{gameplay.maxBet || '—'}</dd>
            <dt>{t('providers')}</dt>
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
            <dt>{t('categories')}</dt>
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
            <dt>{t('games')}</dt>
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
