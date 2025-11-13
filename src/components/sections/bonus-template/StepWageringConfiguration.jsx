import PropTypes from 'prop-types';

import { Input, Select } from 'components/ui/Form';

export function StepWageringConfiguration({ data, onChange, options, baseOptions, errors = {} }) {
  const showBase = data.mode === 'multiplier';
  const showValue = data.mode === 'fixed_amount' || data.mode === 'multiplier';

  return (
    <div className="space-y-4">
      <Select
        label="Wagering Mode"
        data={[{ label: 'Select mode', value: '' }, ...options]}
        value={data.mode}
        onChange={(event) => onChange('mode', event.target.value)}
        error={errors.mode}
      />

      {showBase && (
        <Select
          label="Wagering Base"
          data={[{ label: 'Select base', value: '' }, ...baseOptions]}
          value={data.base}
          onChange={(event) => onChange('base', event.target.value)}
          error={errors.base}
        />
      )}

      {showValue && (
        <Input
          label="Wagering Value"
          type="number"
          placeholder="e.g. 20"
          value={data.wageringValue}
          onChange={(event) => onChange('wageringValue', event.target.value)}
          error={errors.wageringValue}
        />
      )}
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
