import * as Yup from 'yup';

// Reusable number validator for Site Configuration
// Mirrors patterns in `src/app/pages/users/player/schema.js`
// Options:
// - required: boolean (default false)
// - positive: boolean (default false)
// - allowZero: boolean (default true)
// - maxDecimals: number (default 2)
// - min: number | undefined (overrides positive/allowZero when provided)
// - max: number | undefined
export const buildNumberSchema = ({
  required = false,
  positive = false,
  allowZero = true,
  maxDecimals = 2,
  min,
  max
} = {}) => {
  let schema = Yup.number('Must be a number')
    // keep empty string as null to allow optional fields
    .transform((val, originalVal) => {
      if (originalVal === '') return null;
      return isNaN(val) ? null : val;
    })
    .nullable();

  if (required) {
    schema = schema.required('This field is required');
  }

  if (typeof min === 'number') {
    schema = schema.min(min, `Must be greater than or equal to ${min}`);
  } else if (positive) {
    if (allowZero) schema = schema.min(0, 'Must be zero or positive value');
    else schema = schema.positive('Must be a positive number');
  }

  if (typeof max === 'number') {
    schema = schema.max(max, `Must be less than or equal to ${max}`);
  }

  // Decimal places check
  const dec = Math.max(0, Number(maxDecimals) || 0);
  const regex = dec === 0 ? /^-?\d+$/ : new RegExp(`^-?\\d+(?:\\.\\d{1,${dec}})?$`);
  schema = schema.test(
    'max-decimals',
    dec === 0 ? 'No decimals allowed' : `Only up to ${dec} decimal places are allowed`,
    (value) => {
      if (value === undefined || value === null) return true;
      return regex.test(value.toString());
    }
  );

  return schema;
};

// Lightweight immediate validator for raw input strings (without Yup form)
// Returns an error message string or empty string when valid
export const validateNumberValue = (value, opts = {}) => {
  const schema = buildNumberSchema(opts);
  try {
    schema.validateSync(value);
    return '';
  } catch (e) {
    return e?.message || 'Invalid number';
  }
};

export const passwordManagerSchema = Yup.object().shape({
  currentPassword: Yup.string().trim().required('Current password is required'),
  newPassword: Yup.string()
    .trim()
    .required('New password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});
