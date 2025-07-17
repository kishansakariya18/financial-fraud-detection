import * as Yup from 'yup';

export const blacklistEmailPhoneSchema = Yup.object().shape({
  type: Yup.string().oneOf(['email', 'mobile'], 'Select a valid type').required('Type is required'),
  value: Yup.string().when('type', {
    is: 'email',
    then: (schema) => schema.email('Invalid email').required('Email is required'),
    otherwise: (schema) =>
      schema
        .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number')
        .required('Phone number is required')
  }),
  reason: Yup.string().trim().required('Reason is required')
});

export const blacklistIPSchema = Yup.object().shape({
  type: Yup.string().oneOf(['range', 'single'], 'Select a valid type').required('Type is required'),
  ipFrom: Yup.string()
    .required('IP From is required')
    .matches(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Enter a valid IP address'
    ),
  ipTo: Yup.string().when(['type', 'ipFrom'], {
    is: (type, ipFrom) => type === 'single' && ipFrom,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required('IP To is required')
        .matches(
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          'Enter a valid IP address'
        )
        .test(
          'ipTo-ipFrom',
          'IP To must be same as IP From for single type, and different for range type',
          function (value) {
            const { type, ipFrom } = this.parent;
            if (!value || !ipFrom) return true;
            if (type === 'single') return value === ipFrom;
            if (type === 'range') return value !== ipFrom;
            return true;
          }
        )
  }),
  reason: Yup.string().trim().required('Reason is required')
});
