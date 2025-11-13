import PropTypes from 'prop-types';

import { Input, Select, Switch } from 'components/ui/Form';

export function StepMaxCashoutConfiguration({ data, onChange, options, baseOptions, errors = {} }) {
  const showBase = data.mode === 'multiplier';
  const showValue = data.mode === 'fixed_amount' || data.mode === 'multiplier';

  return (
    <div className="space-y-4">
      <Select
        label="Max Cashout Mode"
        data={options}
        value={data.mode}
        onChange={(event) => onChange('mode', event.target.value)}
        error={errors.mode}
      />

      {showBase && (
        <Select
          label="Max Cashout Base"
          data={[{ label: 'Select base', value: '' }, ...baseOptions]}
          value={data.base}
          onChange={(event) => onChange('base', event.target.value)}
          error={errors.base}
        />
      )}

      {showValue && (
        <Input
          label="Cashout Value"
          type="number"
          placeholder="e.g. 5000"
          value={data.cashoutValue}
          onChange={(event) => onChange('cashoutValue', event.target.value)}
          error={errors.cashoutValue}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center">
          <Switch
            label="Sticky Bonus (Non-Withdrawable)"
            checked={data.stickyBonus || false}
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
