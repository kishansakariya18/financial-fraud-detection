import * as Yup from 'yup';

export const addReleaseNoteSchema = Yup.object().shape({
  version: Yup.string()
    .matches(/^v?\d+\.\d+\.\d+$/, 'Version must be in format x.y.z (e.g., 1.0.0)')
    .required('Version is required'),
  title: Yup.string()
    .trim()
    .max(100, 'Title must be 100 characters or less')
    .required('Title is required'),
  description: Yup.string().trim().required('Description is required'),
  releaseDate: Yup.date().required('Release date is required')
});
