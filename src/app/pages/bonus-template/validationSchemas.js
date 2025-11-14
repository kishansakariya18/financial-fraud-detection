import * as Yup from 'yup';

// Reusable schema for a single variable rule item
const variableRuleItemSchema = Yup.object().shape({
  paymentMethod: Yup.string().nullable(),
  rangeFrom: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Must more than 0')
    .typeError('Invalid number'),
  rangeTo: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Must more than 0')
    .typeError('Invalid number')
    .when('rangeFrom', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema.test('greater-than-min', 'Must be ≥ min deposit', function (value) {
          const { rangeFrom } = this.parent;
          if (value === null || value === undefined || value === '') return true;
          const minValue = Number(rangeFrom);
          return !isNaN(minValue) && value >= minValue;
        })
    }),
  boostPercent: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Must more than 0')
    .max(100, 'Must less than or equal to 100')
    .typeError('Invalid number'),
  wagering: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Must more than 0')
    .typeError('Invalid number'),
  mco: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Must more than 0')
    .typeError('Invalid number')
});

// Step 1: Template Info
export const templateInfoSchema = Yup.object().shape({
  templateName: Yup.string().trim().nullable().required('Template name is required'),
  bonusType: Yup.string().nullable().required('Bonus type is required'),
  bonusTags: Yup.array().of(Yup.string()).nullable(),
  expiryAfterIssuanceDays: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(1, 'Expiry days must be at least 1')
    .integer('Expiry days must be a whole number')
    .typeError('Expiry days must be a valid number')
});

// Step 2: Bonus Details
export const bonusDetailsSchema = Yup.object().shape({
  bonusName: Yup.string().trim().nullable(),
  notes: Yup.string().trim().nullable(),
  displayPriority: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .integer('Display priority must be a whole number')
    .min(1, 'Display priority must be at least 1')
    .typeError('Display priority must be a valid number'),
  desktopImage: Yup.mixed().nullable(),
  mobileImage: Yup.mixed().nullable()
});

// Step 3: Reward Details (validates all possible fields, but only relevant ones are used based on bonusType)
export const rewardDetailsSchema = Yup.object().shape({
  // Deposit Boost - Fixed
  boostMode: Yup.string().nullable(),
  boostPercent: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Boost percentage must be 0 or greater')
    .max(1000, 'Boost percentage cannot exceed 1000')
    .typeError('Boost percentage must be a valid number'),
  minDepositAmount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Minimum deposit amount must be 0 or greater')
    .typeError('Minimum deposit amount must be a valid number'),
  // Deposit Boost - Variable
  maxBonusAmount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Max bonus amount must be 0 or greater')
    .typeError('Max bonus amount must be a valid number'),
  variableRules: Yup.array()
    .nullable()
    .when('boostMode', {
      is: (val) => val === 'variable',
      then: (schema) => schema.of(variableRuleItemSchema),
      otherwise: (schema) => schema.nullable()
    }),
  // Free Chip
  amount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Chip amount must be 0 or greater')
    .typeError('Chip amount must be a valid number'),
  // Free Spins
  gameId: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .typeError('Game ID must be a valid number'),
  spinsCount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(1, 'Spins count must be at least 1')
    .integer('Spins count must be a whole number')
    .typeError('Spins count must be a valid number'),
  denominationPerSpin: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Denomination per spin must be 0 or greater')
    .typeError('Denomination per spin must be a valid number'),
  maxFreeSpinWinnings: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Max free spin winnings must be 0 or greater')
    .typeError('Max free spin winnings must be a valid number')
});

// Step 4: Wagering Configuration
export const wageringConfigSchema = Yup.object().shape({
  mode: Yup.string().nullable(),
  base: Yup.string().nullable(),
  wageringValue: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Wagering value must be 0 or greater')
    .typeError('Wagering value must be a valid number')
});

// Step 5: Max Cashout Configuration
export const maxCashoutConfigSchema = Yup.object().shape({
  mode: Yup.string().nullable(),
  base: Yup.string().nullable(),
  cashoutValue: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Cashout value must be 0 or greater')
    .typeError('Cashout value must be a valid number'),
  stickyBonus: Yup.boolean().nullable()
  //   kycRequired: Yup.boolean().nullable()
});

// Step 6: Gameplay Configuration
export const gameplaySchema = Yup.object().shape({
  minBet: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Minimum bet must be 0 or greater')
    .typeError('Minimum bet must be a valid number'),
  maxBet: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Maximum bet must be 0 or greater')
    .typeError('Maximum bet must be a valid number')
    .when('minBet', {
      is: (val) => val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema.test(
          'greater-than-min',
          'Maximum bet must be greater than or equal to minimum bet',
          function (value) {
            const { minBet } = this.parent;
            if (value === null || value === undefined || value === '') return true;
            const minValue = Number(minBet);
            return !isNaN(minValue) && value >= minValue;
          }
        )
    }),
  providers: Yup.array().of(Yup.string()).nullable(),
  providerIncluded: Yup.boolean().nullable(),
  categories: Yup.array().of(Yup.string()).nullable(),
  categoryIncluded: Yup.boolean().nullable(),
  games: Yup.array().of(Yup.string()).nullable(),
  gameIncluded: Yup.boolean().nullable()
});

export const variableRulesSchema = Yup.object().shape({
  variableRules: Yup.array().of(variableRuleItemSchema)
});

// All step schemas mapped to step IDs
export const stepSchemas = {
  templateInfo: templateInfoSchema,
  bonusDetails: bonusDetailsSchema,
  rewardDetails: rewardDetailsSchema,
  wageringConfiguration: wageringConfigSchema,
  maxCashoutConfiguration: maxCashoutConfigSchema,
  gameplayConfiguration: gameplaySchema,
  variableRules: variableRulesSchema
};
