import * as Yup from 'yup';

export const createCampaignSchema = Yup.object().shape({
  campaignName: Yup.string()
    .trim()
    .min(3, 'Campaign Name must be at least 3 characters')
    .max(50, 'Campaign Name must be at most 50 characters')
    .required('Campaign Name is required'),

  status: Yup.string()
    .oneOf(['active', 'inactive', 'archive'], 'Invalid status')
    .required('Status is required'),

  startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Start Date must be a valid date'),

  endDate: Yup.date()
    .required('End Date is required')
    .typeError('End Date must be a valid date')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date'),

  description: Yup.string().max(240, 'Description must be at most 240 characters').optional(),

  tags: Yup.array().of(Yup.string()).optional(),

  targetSegment: Yup.string().optional(),

  forceIncludePlayers: Yup.string().optional(),

  forceExcludePlayers: Yup.string().optional(),
  // Bonus Removal Rules
  removeAfterTimeEnabled: Yup.boolean().optional(),
  removeAfterTimeValue: Yup.number()
    .transform((v, o) => (o === '' || o === null ? undefined : v))
    .when('removeAfterTimeEnabled', (enabled, schema) =>
      enabled ? schema.required('Time is required').min(1, 'Must be at least 1') : schema.optional()
    ),
  removeAfterTimeUnit: Yup.string()
    .oneOf(['minutes', 'hours', 'days', 'weeks'], 'Invalid unit')
    .when('removeAfterTimeEnabled', (enabled, schema) =>
      enabled ? schema.required() : schema.optional()
    ),
  removeOnExitSegment: Yup.boolean().optional(),
  fixedCutoffDate: Yup.date()
    .typeError('Fixed Cut-off Date must be a valid date')
    .nullable()
    .when('removeAfterTimeEnabled', (enabled, schema) =>
      enabled ? schema.required('Fixed Cut-off Date is required') : schema.optional()
    ),
  maxClaimsAcrossPromotions: Yup.number()
    .transform((v, o) => (o === '' || o === null ? undefined : v))
    .min(0, 'Must be 0 or greater')
    .optional(),

  // Triggers & Schedule
  onSegmentEntry: Yup.boolean().optional(),
  onSegmentExit: Yup.boolean().optional(),
  recurring: Yup.boolean().optional(),
  scheduleDays: Yup.array()
    .of(Yup.number())
    .when('recurring', (recurring, schema) => {
      // We need to check if scheduleType is weekly. However, scheduleType is local state in the component.
      // But we can infer it: if scheduleDays has values, it's weekly.
      // Actually, we should probably rely on the fact that if recurring is true, either days+time OR interval+anchor is required.
      // But since we don't have scheduleType in the form data, we can't strictly validate "one or the other".
      // A loose validation: if recurring is true, at least one schedule config must be valid.
      // For now, let's just validate the types if present.
      return schema.optional();
    }),
  scheduleTime: Yup.string()
    .nullable()
    .when(['recurring', 'scheduleDays'], ([recurring, scheduleDays], schema) => {
      if (recurring && scheduleDays && scheduleDays.length > 0) {
        return schema.required('Time is required for weekly schedule');
      }
      return schema.optional();
    }),
  scheduleInterval: Yup.number()
    .transform((v, o) => (o === '' || o === null ? undefined : v))
    .nullable()
    .min(1, 'Minimum 1 hour')
    .max(168, 'Maximum 168 hours')
    .when(['recurring', 'scheduleDays'], ([recurring, scheduleDays], schema) => {
      if (recurring && (!scheduleDays || scheduleDays.length === 0)) {
        // If recurring is true and NO days selected, we assume it's hourly schedule (or user hasn't selected anything yet).
        // We can enforce interval if we assume empty days means hourly mode.
        return schema.required('Interval is required');
      }
      return schema.optional();
    }),
  scheduleAnchor: Yup.string()
    .nullable()
    .when(['recurring', 'scheduleDays'], ([recurring, scheduleDays], schema) => {
      if (recurring && (!scheduleDays || scheduleDays.length === 0)) {
        return schema.required('Anchor is required');
      }
      return schema.optional();
    }),

  // Re-Issuance Policy
  reIssuancePolicy: Yup.string()
    .oneOf(['one', 'reissue', 'stack'], 'Invalid re-issuance policy')
    .required('Re-Issuance Policy is required'),
  allowStackN: Yup.number()
    .transform((v, o) => (o === '' || o === null ? undefined : v))
    .when('reIssuancePolicy', ([policy], schema) =>
      policy === 'stack' ? schema.required('Stack N is required').min(1).max(50) : schema.optional()
    )
});
