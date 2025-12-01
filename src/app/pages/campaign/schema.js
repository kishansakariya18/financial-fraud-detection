import * as Yup from 'yup';

export const createCampaignSchema = Yup.object().shape({
  campaignName: Yup.string()
    .trim()
    .min(3, 'Campaign Name must be at least 3 characters')
    .max(50, 'Campaign Name must be at most 50 characters')
    .required('Campaign Name is required'),

  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),

  startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Start Date must be a valid date'),

  endDate: Yup.date()
    .required('End Date is required')
    .typeError('End Date must be a valid date')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date'),

  description: Yup.string().max(240, 'Description must be at most 240 characters').optional(),

  tags: Yup.array().of(Yup.string()).optional()
});
