import * as Yup from 'yup';

export const crmSchema = Yup.object().shape({
  channel: Yup.string().trim().required('Channel Required'),
  // segmentationID: Yup.string().required('Segmentation ID Required'),
  segmentationID: Yup.number()
    .typeError('Segmentation ID must be a number')
    .integer('Segmentation ID must be an integer')
    .required('Segmentation ID Required'),
  subject: Yup.string().trim().required('Subject Required')
  // description: Yup.string().trim().required('Description Required')
});
