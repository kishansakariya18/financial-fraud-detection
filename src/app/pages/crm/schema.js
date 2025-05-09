import * as Yup from 'yup';

export const crmSchema = Yup.object().shape({
  // Personal Information
  subject: Yup.string().trim().required('Subject Required'),
  // description: Yup.string().trim().required('Description Required'),
  segmentationID: Yup.string().trim().required('To Required')
});
