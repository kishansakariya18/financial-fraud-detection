import Select from 'react-select';

function CustomSelect({
  options = [],
  value,
  onChange,
  isMulti = false,
  isSearchable = true,
  placeholder = 'Select...',
  showLabel = false,
  labelText = 'Choose an option:',
  error = '',
  parentClass = '',
  ...props
}) {
  // React-Select styles to align with Bootstrap form-control
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error
        ? '#dc3545' // Red border for errors
        : state.isFocused
          ? '#80bdff' // Blue focus border
          : '#ced4da', // Default border
      boxShadow: state.isFocused
        ? error
          ? '0 0 0 0.2rem rgba(220,53,69,0.25)' // Red shadow for errors
          : '0 0 0 0.2rem rgba(0,123,255,0.25)' // Blue shadow for focus
        : 'none',
      '&:hover': {
        borderColor: error ? '#dc3545' : '#80bdff'
      },
      minHeight: '38px', // Bootstrap input height
      borderRadius: '0.25rem' // Match Bootstrap's rounded corners
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6c757d' // Placeholder text color
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999 // Ensures dropdown menu stays on top
    })
  };

  return (
    <div className={parentClass}>
      {/* Label */}
      {showLabel && (
        <label htmlFor="custom-select" className="form-label">
          {labelText}
        </label>
      )}

      {/* React-Select Component */}
      <Select
        id="custom-select"
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isSearchable={isSearchable}
        placeholder={placeholder}
        styles={customStyles} // Apply Bootstrap-like styles
        classNamePrefix={`react-select`}
        {...props}
      />

      {/* Error Message */}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

export { CustomSelect };
