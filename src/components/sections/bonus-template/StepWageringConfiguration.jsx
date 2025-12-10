import PropTypes from 'prop-types';

import { Input, Select } from 'components/ui/Form';
import { useTranslation } from 'react-i18next';

export function StepWageringConfiguration({ data, onChange, options, baseOptions, errors = {} }) {
  const { t } = useTranslation();
  const showBase = data.mode === 'multiplier';
  const showValue = data.mode === 'fixed_amount' || data.mode === 'multiplier';
  const daysDisabled = data.mode === 'none';

  const handleDaysChange = (event) => {
    if (daysDisabled) {
      onChange('daysToWager', '');
      return;
    }
    const raw = event.target.value;
    if (data.mode === 'none') {
      onChange('daysToWager', '');
      return;
    }
    if (raw === '' || raw === null || raw === undefined) {
      onChange('daysToWager', '');
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    const clamped = Math.max(1, Math.min(365, Math.trunc(num)));
    onChange('daysToWager', clamped);
  };

  return (
    <div className="space-y-4">
      <Select
        label={t('wagering_mode')}
        data={options || []}
        value={data.mode}
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'multiplier' && !data.base) {
            onChange('base', baseOptions[0]?.value);
          }
          if (value === 'none') {
            onChange('wageringValue', '');
            onChange('base', '');
            onChange('daysToWager', '');
          }
          onChange('mode', value);
        }}
        error={errors.mode}
      />

      {showBase && (
        <Select
          label={t('wagering_base')}
          data={[{ label: t('select_base'), value: '' }, ...baseOptions]}
          value={data.base}
          onChange={(event) => onChange('base', event.target.value)}
          error={errors.base}
        />
      )}

      <Input
        label={t('wagering_value')}
        type="number"
        placeholder={t('enter_wagering_value_info')}
        value={data.wageringValue}
        disabled={!showValue}
        onChange={(event) => onChange('wageringValue', event.target.value)}
        error={errors.wageringValue}
      />

      <Input
        label={t('days_to_wager')}
        type="number"
        placeholder={t('enter_days_to_wager_info')}
        value={data.daysToWager}
        disabled={daysDisabled}
        onChange={handleDaysChange}
        // Hide validation while disabled so "required" doesn't show for mode none
        error={daysDisabled ? undefined : errors.daysToWager}
      />
    </div>
  );
}

StepWageringConfiguration.propTypes = {
  data: PropTypes.shape({
    mode: PropTypes.string,
    base: PropTypes.string,
    wageringValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  baseOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  errors: PropTypes.object
};
