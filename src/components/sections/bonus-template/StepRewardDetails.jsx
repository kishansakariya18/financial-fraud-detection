import PropTypes from 'prop-types';

import { Input, Radio } from 'components/ui/Form';
import { VariableRulesEditor } from './VariableRulesEditor';
import { GameSelect } from './GameSelect';
import { useTranslation } from 'react-i18next';
export function StepRewardDetails({
  data,
  onChange,
  bonusType,
  boostModeOptions,
  paymentMethodOptions,
  onRulesChange,
  onValidateRuleField,
  onGameOptionsCache,
  errors = {}
}) {
  const { t } = useTranslation();
  // Deposit Boost Configuration
  if (bonusType === 'deposit_boost') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">{t('boost_mode')}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {boostModeOptions.map((option) => (
              <Radio
                key={option.value}
                name="boostMode"
                label={option.label}
                value={option.value}
                checked={data.boostMode === option.value}
                onChange={(event) => onChange('boostMode', event.target.value)}
              />
            ))}
          </div>
          {errors.boostMode && (
            <p className="mt-2 text-sm text-error dark:text-error-light">{errors.boostMode}</p>
          )}
        </div>

        {data.boostMode === 'fixed' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t('boost_percentage')}
              type="number"
              placeholder={t('boost_percentage_placeholder')}
              value={data.boostPercent}
              onChange={(event) => onChange('boostPercent', event.target.value)}
              error={errors.boostPercent}
            />
            <Input
              label={t('minimum_deposit_amount')}
              type="number"
              placeholder={t('minimum_deposit_amount_placeholder')}
              value={data.minDepositAmount}
              onChange={(event) => onChange('minDepositAmount', event.target.value)}
              error={errors.minDepositAmount}
            />
          </div>
        )}

        {data.boostMode === 'variable' && (
          <div className="space-y-4">
            <Input
              label={t('max_bonus_amount')}
              type="any"
              placeholder={t('max_bonus_amount_placeholder')}
              value={data.maxBonusAmount}
              onChange={(event) => onChange('maxBonusAmount', event.target.value)}
              error={errors.maxBonusAmount}
            />
            <VariableRulesEditor
              rules={data.variableRules || []}
              onChange={onRulesChange}
              onValidateRuleField={onValidateRuleField}
              paymentMethodOptions={paymentMethodOptions}
              errors={errors}
            />
            {/* {errors.variableRules && (
              <p className="mt-2 text-sm text-error dark:text-error-light">
                {errors.variableRules}
              </p>
            )} */}
          </div>
        )}
      </div>
    );
  }

  // Free Chip Configuration
  if (bonusType === 'free_chip') {
    return (
      <div className="space-y-4">
        <Input
          label={t('chip_amount')}
          type="number"
          placeholder={t('chip_amount_placeholder')}
          value={data.amount}
          onChange={(event) => onChange('amount', event.target.value)}
          error={errors.amount}
        />
      </div>
    );
  }

  // Free Spins Configuration
  if (bonusType === 'free_spins') {
    return (
      <div className="space-y-4">
        <GameSelect
          value={data.selectedGame}
          onChange={(selected) => {
            onChange('gameId', selected?.value || ''),
              onChange('selectedGame', {
                value: selected?.value || '',
                label: selected?.label || ''
              });
          }}
          placeholder={t('search_game_info')}
          error={errors.gameId}
          filters={{
            onlyFreeSpinSupport: 1
          }}
          onOptionsCache={onGameOptionsCache}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('spins_count')}
            type="number"
            placeholder={t('spins_count_placeholder')}
            value={data.spinsCount}
            onChange={(event) => onChange('spinsCount', event.target.value)}
            error={errors.spinsCount}
          />
          <Input
            label={t('denomination_per_spin')}
            type="number"
            placeholder={t('denomination_per_spin_placeholder')}
            value={data.denominationPerSpin}
            onChange={(event) => onChange('denominationPerSpin', event.target.value)}
            error={errors.denominationPerSpin}
          />
        </div>
        <Input
          label={t('max_free_spin_winnings')}
          type="number"
          placeholder={t('max_free_spin_winnings_placeholder')}
          value={data.maxFreeSpinWinnings}
          onChange={(event) => onChange('maxFreeSpinWinnings', event.target.value)}
          error={errors.maxFreeSpinWinnings}
        />
      </div>
    );
  }

  // Default: No bonus type selected
  return (
    <div className="text-center text-gray-500 dark:text-dark-200">
      {t('please_select_bonus_type_info')}
    </div>
  );
}

StepRewardDetails.propTypes = {
  data: PropTypes.shape({
    boostMode: PropTypes.string,
    boostPercent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minDepositAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxBonusAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variableRules: PropTypes.array,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    spinsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denominationPerSpin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxFreeSpinWinnings: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  bonusType: PropTypes.string,
  boostModeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  paymentMethodOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onRulesChange: PropTypes.func,
  onValidateRuleField: PropTypes.func,
  onGameOptionsCache: PropTypes.func,
  errors: PropTypes.object
};
