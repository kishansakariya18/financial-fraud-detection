import * as Yup from 'yup';

export const createFaqSchema = Yup.object().shape({
  question: Yup.string()
    .trim()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question must be at most 500 characters')
    .required('Question is required'),
  answer: Yup.string()
    .trim()
    .min(2, 'Answer must be at least 2 characters')
    .max(2000, 'Answer must be at most 2000 characters')
    .required('Answer is required'),
  module: Yup.string().required('Module is required'),
  sortOrder: Yup.number()
    .typeError('Sort order must be a number')
    .integer('Sort order must be an integer')
    .min(0, 'Sort order cannot be negative')
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
});

export const editFaqSchema = Yup.object().shape({
  question: Yup.string()
    .trim()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question must be at most 500 characters')
    .required('Question is required'),
  answer: Yup.string()
    .trim()
    .min(2, 'Answer must be at least 2 characters')
    .max(2000, 'Answer must be at most 2000 characters')
    .required('Answer is required'),
  module: Yup.string().oneOf(['GLOBAL', 'AFFILIATE', 'EARNINGS']).required('Module is required'),
  status: Yup.mixed()
    .oneOf(['0', '1', 0, 1])
    .required('Status is required')
    .transform((v) => (typeof v === 'number' ? String(v) : v)),
  sortOrder: Yup.number()
    .typeError('Sort order must be a number')
    .integer('Sort order must be an integer')
    .min(0, 'Sort order cannot be negative')
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
});
