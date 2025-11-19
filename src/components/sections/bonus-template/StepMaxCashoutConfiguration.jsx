import PropTypes from 'prop-types';

import { Input, Select, Switch } from 'components/ui/Form';
import { useTranslation } from 'react-i18next';

export function StepMaxCashoutConfiguration({ data, onChange, options, baseOptions, errors = {} }) {
  const { t } = useTranslation();
  const showBase = data.mode === 'multiplier';
  const showValue = data.mode === 'fixed_amount' || data.mode === 'multiplier';

  return (
    <div className="space-y-4">
      <Select
        label={t('max_cashout_mode')}
        data={options}
        value={data.mode}
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'multiplier' && !data.base) {
            onChange('base', baseOptions[0]?.value);
          }
          if (value === 'none') {
            onChange('cashoutValue', '');
            onChange('base', '');
            onChange('stickyBonus', false);
          }
          onChange('mode', value);
        }}
        error={errors.mode}
      />

      {showBase && (
        <Select
          label={t('max_cashout_base')}
          data={[{ label: t('select_base'), value: '' }, ...baseOptions]}
          value={data.base}
          onChange={(event) => onChange('base', event.target.value)}
          error={errors.base}
        />
      )}

      <Input
        label={t('cashout_value')}
        type="number"
        placeholder={t('enter_cashout_value_info')}
        value={data.cashoutValue}
        disabled={!showValue}
        onChange={(event) => onChange('cashoutValue', event.target.value)}
        error={errors.cashoutValue}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center">
          <Switch
            label={t('sticky_bonus')}
            checked={data.stickyBonus || false}
            disabled={!showValue}
            onChange={(event) => onChange('stickyBonus', event.target.checked)}
          />
        </div>
        {/* <div className="flex items-center">
          <Switch
            label="KYC Required"
            checked={data.kycRequired || false}
            onChange={(event) => onChange('kycRequired', event.target.checked)}
          />
        </div> */}
      </div>
    </div>
  );
}

StepMaxCashoutConfiguration.propTypes = {
  data: PropTypes.shape({
    mode: PropTypes.string,
    base: PropTypes.string,
    cashoutValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stickyBonus: PropTypes.bool,
    kycRequired: PropTypes.bool
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
