import * as Yup from 'yup';

export const createBankDepositSchema = Yup.object().shape({
  // Personal Information
  bankName: Yup.string().trim().required('Bank Name Required'),
  accountHolderName: Yup.string().trim().required('Account Holder Name Required'),
  accountNumber: Yup.string().trim().required('Account Number Required'),
  bankCode: Yup.string().trim().required('Bank Code Required'),
  upiID: Yup.string().trim().required('UPI ID Required')
});
