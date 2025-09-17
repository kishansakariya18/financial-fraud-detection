import * as Yup from 'yup';

const accountNumberRegex = /^\d{8,22}$/;
const ifscCodeRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const upiIDRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

export const createBankDepositSchema = Yup.object().shape({
  // Bank Information
  bankName: Yup.string()
    .trim()
    .min(2, 'Bank name must be at least 2 characters')
    .max(100, 'Bank name cannot exceed 100 characters')
    .required('Bank name is required'),

  accountHolderName: Yup.string()
    .trim()
    .min(3, 'Account holder name must be at least 3 characters')
    .max(100, 'Account holder name cannot exceed 100 characters')
    .matches(
      /^[a-zA-Z\s.'-]+$/,
      'Only alphabets, spaces, hyphens, apostrophes and periods are allowed'
    )
    .required('Account holder name is required'),

  accountNumber: Yup.string()
    .trim()
    .matches(accountNumberRegex, 'Account number must be 8-22 digits')
    .required('Account number is required'),

  bankCode: Yup.string()
    .trim()
    .matches(ifscCodeRegex, 'Please enter a valid IFSC code')
    .required('Bank code (IFSC) is required')
    .uppercase('IFSC code must be in uppercase'),

  upiID: Yup.string()
    .trim()
    .matches(upiIDRegex, 'Please enter a valid UPI ID (e.g., name@bank)')
    .required('UPI ID is required')
    .lowercase('UPI ID should be in lowercase'),

  // Require selecting a currency
  currencyID: Yup.mixed()
    .test(
      'valid-currency',
      'Currency is required',
      (val) => val !== undefined && val !== null && `${val}`.trim() !== ''
    )
    .required('Currency is required')
});
