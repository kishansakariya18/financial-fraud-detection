import * as Yup from 'yup';

export const crmSchema = Yup.object().shape({
  channel: Yup.string().trim().required('Channel Required'),
  // segmentationID: Yup.string().required('Segmentation ID Required'),
  segmentationID: Yup.number()
    .typeError('Segmentation ID Required')
    .integer('Segmentation ID Required')
    .required('Segmentation ID Required'),
  subject: Yup.string().trim().required('Subject Required'),
  // description: Yup.string().trim().required('Description Required')
  sendType: Yup.number().required('Send type is required'),
  deliveryDateTime: Yup.date()
    .nullable()
    .transform((value, originalValue) => {
      // Treat empty string or null as an actual null value so Yup doesn't cast to Invalid Date
      return originalValue === '' || originalValue === null ? null : value;
    })
    .typeError('Please provide a valid date')
    .when('sendType', {
      is: (val) => val === 2,
      then: (schema) => schema.required('Delivery datetime is required'),
      otherwise: (schema) => schema.notRequired()
    })
});
