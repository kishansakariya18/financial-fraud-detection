// Import Dependencies
import PropTypes from 'prop-types';
import { useRef, forwardRef } from 'react';

// Local Imports
import { useMergedRef } from 'hooks';

// ----------------------------------------------------------------------

const Upload = forwardRef((props, ref) => {
  const {
    onChange = () => {},
    children,
    multiple,
    accept,
    name,
    form,
    setPreview = () => {},
    disabled,
    capture,
    inputProps,
    ...rest
  } = props;
  const inputRef = useRef();

  const onClick = () => {
    !disabled && inputRef.current.click();
  };

  const handleChange = (event) => {
    // console.log('event:', event.currentTarget.files[0]);

    if (multiple) {
      onChange(Array.from(event.currentTarget.files));
    } else {
      setPreview(URL.createObjectURL(event.currentTarget.files[0]));
      onChange(event.currentTarget.files[0] || null);
    }
  };

  return (
    <>
      {children({ onClick, disabled, ...rest })}

      <input
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        ref={useMergedRef(ref, inputRef)}
        name={name}
        form={form}
        capture={capture}
        {...inputProps}
      />
    </>
  );
});

Upload.displayName = 'Upload';

Upload.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  capture: PropTypes.string,
  name: PropTypes.string,
  form: PropTypes.string,
  inputProps: PropTypes.object
};

export { Upload };
