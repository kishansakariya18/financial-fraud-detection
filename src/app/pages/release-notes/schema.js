import * as Yup from 'yup';

export const addReleaseNoteSchema = Yup.object().shape({
  version: Yup.string()
    .matches(/^v?\d+\.\d+\.\d+$/, 'Version must be in format x.y.z (e.g., 1.0.0)')
    .required('Version is required'),
  title: Yup.string()
    .trim()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must be 100 characters or less')
    .required('Title is required'),
  description: Yup.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be 1000 characters or less')
    .required('Description is required'),
  releaseDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => {
      // Treat empty string or null as an actual null value so Yup doesn't cast to Invalid Date
      return originalValue === '' || originalValue === null ? null : value;
    })
    .typeError('Please provide a valid date')
    .required('Release date is required')
});
