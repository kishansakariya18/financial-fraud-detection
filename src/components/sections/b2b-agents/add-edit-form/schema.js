import * as yup from 'yup';

// Base commission schema
const baseCommissionSchema = yup.object().shape({
  commissionType: yup.string().required('Commission type is required')
});

// Turnover commission schema
const turnoverCommissionSchema = baseCommissionSchema.shape({
  turnoverPercent: yup
    .number()
    .typeError('Turnover percent is required')
    .required('Turnover percent is required')
    .min(0, 'Percent must be at least 0')
    .max(100, 'Percent cannot exceed 100')
});

// CPA commission schema with conditional validation
const cpaCommissionSchema = baseCommissionSchema.shape({
  cpaPayoutAmount: yup
    .number()
    .typeError('CPA amount is required')
    .required('CPA amount is required')
    .min(0, 'CPA amount must be at least 0'),
  cpaTrigger: yup
    .string()
    .required('CPA trigger is required')
    .oneOf(['deposit', 'bet', 'both'], 'Invalid CPA trigger'),
  cpaDepositMinAmount: yup
    .number()
    .typeError('Minimum deposit amount is required')
    .when('CpaTrigger', {
      is: (trigger) => trigger === 'deposit' || trigger === 'both',
      then: (schema) =>
        schema
          .required('Minimum deposit amount is required')
          .min(0, 'Minimum deposit amount must be at least 0'),
      otherwise: (schema) => schema.nullable()
    }),
  cpaBetMinAmount: yup
    .number()
    .typeError('Minimum bet amount is required')
    .when('CpaTrigger', {
      is: (trigger) => trigger === 'bet' || trigger === 'both',
      then: (schema) =>
        schema
          .required('Minimum bet amount is required')
          .min(0, 'Minimum bet amount must be at least 0'),
      otherwise: (schema) => schema.nullable()
    })
});

// Dynamic commission validation based on type
export const commissionValidation = yup.lazy((value) => {
  switch (value?.CommissionType) {
    case 'turnover':
      return turnoverCommissionSchema;
    case 'cpa':
      return cpaCommissionSchema;
    default:
      return baseCommissionSchema;
  }
});

// Array of commissions validation
export const commissionsArraySchema = yup
  .array()
  .of(commissionValidation)
  .min(0, 'Commissions are optional');

// Create separate schemas for add and edit modes
export const createAgentFormSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('User Name Required')
    .matches(
      /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$/,
      'Username must start with a letter, contain only letters, numbers, or underscores, cannot have consecutive or ending underscores, and must be 3–30 characters long.'
    ),
  firstname: yup
    .string()
    .trim()
    .required('First Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  lastname: yup
    .string()
    .trim()
    .required('Last Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  email: yup
    .string()
    .trim()
    .required('Email Required')
    .matches(
      /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Enter a valid email address without the "+" symbol'
    ),
  mobile: yup
    .string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: yup.string().trim().required('Select Country Code'),
  password: yup
    .string()
    .required('Password Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
    ),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Please select a valid status'),
  commissionPercent: yup
    .number()
    .typeError('Commission percentage is required')
    .required('Commission percentage is required')
    .min(0, 'Commission percentage must be at least 0')
    .max(100, 'Commission percentage cannot exceed 100'),
  commissions: commissionsArraySchema
});

export const editAgentFormSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('User Name Required')
    .matches(
      /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]{1,28}[a-zA-Z0-9]$/,
      'Username must start with a letter, contain only letters, numbers, or underscores, cannot have consecutive or ending underscores, and must be 3–30 characters long.'
    ),
  firstname: yup
    .string()
    .trim()
    .required('First Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  lastname: yup
    .string()
    .trim()
    .required('Last Name Required')
    .max(40, 'Maximum 40 Characters Allowed'),
  email: yup
    .string()
    .trim()
    .required('Email Required')
    .matches(
      /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Enter a valid email address without the "+" symbol'
    ),
  mobile: yup
    .string()
    .trim()
    .required('Enter Your Mobile Number')
    .length(10, 'Mobile Number Must Contain 10 Digits')
    .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
  phoneCode: yup.string().trim().required('Select Country Code'),
  password: yup
    .string()
    .trim()
    .test(
      'password-validation',
      'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character',
      (value) => {
        if (!value || value.length === 0) return true; // skip if empty
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
      }
    ),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Please select a valid status'),
  commissionPercent: yup
    .number()
    .typeError('Commission percentage is required')
    .required('Commission percentage is required')
    .min(0, 'Commission percentage must be at least 0')
    .max(100, 'Commission percentage cannot exceed 100'),
  commissions: commissionsArraySchema
});
