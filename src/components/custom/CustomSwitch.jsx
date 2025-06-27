import { Switch } from 'components/ui';
import PropTypes from 'prop-types';

export default function CustomSwitch({ checked, onChange, label, className = '' }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
        <Switch checked={checked} onChange={onChange} />
      </span>
    </label>
  );
}

CustomSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string
};
