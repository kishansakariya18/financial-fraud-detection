import * as Yup from 'yup';

export const crmSchema = Yup.object().shape({
  channel: Yup.string().trim().required('Channel Required'),
  sendTo: Yup.string(),
  segmentationID: Yup.number().when('sendTo', {
    is: 'segmentation',
    then: (schema) =>
      schema
        .typeError('Segmentation Required')
        .integer('Segmentation Required')
        .required('Segmentation Required'),
    otherwise: (schema) => schema.notRequired()
  }),
  UserClassID: Yup.number().when('sendTo', {
    is: 'userClass',
    then: (schema) =>
      schema
        .typeError('Player Class Required')
        .integer('Player Class Required')
        .required('Player Class Required'),
    otherwise: (schema) => schema.notRequired()
  }),
  subject: Yup.string().trim().required('Subject Required'),
  // description: Yup.string().trim().required('Description Required')
  sendType: Yup.number().required('Send type is required'),
  deliveryDateTime: Yup.date().when('sendType', {
    is: (val) => val === 2,
    then: (schema) => schema.required('Schedule datetime is required'),
    otherwise: (schema) => schema.notRequired()
  })
});
