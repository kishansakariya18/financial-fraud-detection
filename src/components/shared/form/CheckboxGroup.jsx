// Import Dependencies
import PropTypes from 'prop-types';
import { Checkbox } from 'components/ui';

const CheckboxGroup = ({ data, value, onChange, name, label, error, displayField = 'label' }) => {
  const handleCheckboxChange = (itemValue) => {
    const newValue = value?.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...(value || []), itemValue];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-dark-200">{label}</label>
      )}
      <div className="flex flex-wrap gap-4">
        {data.map((item) => (
          <Checkbox
            key={item.value}
            label={item[displayField]}
            checked={value?.includes(item.value)}
            onChange={() => handleCheckboxChange(item.value)}
            name={name}
          />
        ))}
      </div>
      {error && <span className="error-600 text-sm">{error}</span>}
    </div>
  );
};

CheckboxGroup.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  displayField: PropTypes.string
};

export { CheckboxGroup };
