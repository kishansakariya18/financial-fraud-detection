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
  deliveryDateTime: Yup.date().when('sendType', {
    is: (val) => val === 2,
    then: (schema) => schema.required('Schedule datetime is required'),
    otherwise: (schema) => schema.notRequired()
  })
});
