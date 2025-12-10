import * as Yup from 'yup';

// Helper function to transform string/number to number or null
const numberTransform = (value, originalValue) => {
  return originalValue === '' || originalValue === null || originalValue === undefined
    ? null
    : Number(originalValue);
};

// Reusable schema for a single variable rule item
const variableRuleItemSchema = Yup.object()
  .shape({
    paymentMethod: Yup.string().nullable(),
    rangeFrom: Yup.number()
      .transform(numberTransform)
      .nullable()
      .test('required-range-from', 'Please add min deposit', (val) => {
        return val !== null && val !== undefined && val !== '';
      })
      .min(0, 'Min Deposit Must be greater than 0')
      .test('required-when-range-to-exists', 'Please add min deposit', function (value) {
        const { rangeTo } = this.parent;
        // If rangeTo is set, rangeFrom is required
        if (value === 0 && rangeTo > 0) {
          return false;
        }
        if (rangeTo !== null && rangeTo !== undefined && rangeTo !== '') {
          return value !== null && value !== undefined && value !== '';
        }

        return true;
      })
      .typeError('Min Deposit Invalid number'),
    rangeTo: Yup.number()
      .transform(numberTransform)
      .nullable()
      .test('required-range-to', 'Please add max deposit', (val) => {
        return val !== null && val !== undefined && val !== '';
      })
      .min(0, 'Max Deposit Must be greater than 0')
      .test(
        'greater-than-range-from',
        'Max Deposit Must be greater than min deposit',
        function (value) {
          const { rangeFrom } = this.parent;
          // If both values exist, rangeTo must be >= rangeFrom
          if (
            value !== null &&
            value !== undefined &&
            value !== '' &&
            rangeFrom !== null &&
            rangeFrom !== undefined &&
            rangeFrom !== ''
          ) {
            const minValue = Number(rangeFrom);
            const maxValue = Number(value);
            if (!isNaN(minValue) && !isNaN(maxValue)) {
              return maxValue >= minValue;
            }
          }
          return true;
        }
      )
      .typeError('Max Deposit Invalid number'),
    boostPercent: Yup.number()
      .transform(numberTransform)
      .nullable()
      .min(0, 'Boos(%) Must be greater than 0')
      .max(100, 'Boos(%) Must be less than or equal to 100')
      .typeError('Boos(%) Invalid number'),
    wagering: Yup.number()
      .transform(numberTransform)
      .nullable()
      .test('required-wagering', 'Please add wagering', (val) => {
        return val !== null && val !== undefined && val !== '';
      })
      .min(0, 'Wagering Must be greater than 0')
      .typeError('Wagering Invalid number'),
    mco: Yup.number()
      .transform(numberTransform)
      .nullable()
      .test('required-mco', 'Please add max cashout', (val) => {
        return val !== null && val !== undefined && val !== '';
      })
      .min(0, 'Max Cashout Must be greater than 0')
      .typeError('Max Cashout Invalid number')
  })
  .test('continuous-range-with-previous', 'Range continuity error', function (currentRule) {
    let parentArray;

    // Try to get array from validation context stack
    if (this.from && this.from.length > 1) {
      // Navigate up to find the array
      for (let i = this.from.length - 1; i >= 0; i--) {
        const context = this.from[i];
        if (context && context.value && context.value?.variableRules) {
          parentArray = context.value?.variableRules.map((rule, idx) => ({
            ...rule,
            mapIndex: idx
          }));
          break;
        }
      }
    }

    // Fallback: try to get from parent object if it has variableRules
    if (!parentArray && this.parent && this.parent.variableRules) {
      parentArray = this.parent.variableRules.map((rule, idx) => ({ ...rule, mapIndex: idx }));
    }

    if (!parentArray || !Array.isArray(parentArray)) return true;

    const currentIndex = parentArray.findIndex(
      (rule) => rule === currentRule || (rule.id && currentRule.id && rule.id === currentRule.id)
    );
    if (currentIndex <= 0) return true; // First rule, no previous to check

    const currentFrom = currentRule.rangeFrom;
    // const currentTo = currentRule.rangeTo;
    const paymentMethod = currentRule?.paymentMethod || 'all';

    // Skip if rangeFrom is invalid
    if (isNaN(currentFrom) || currentFrom === null || currentFrom === undefined) {
      const hasExistAfterThisRuleWithSamePayment =
        parentArray
          .slice(currentIndex)
          .filter((rule) => (rule?.paymentMethod || 'all') === paymentMethod).length > 0;
      if (hasExistAfterThisRuleWithSamePayment) {
        return this.createError({
          path: `variableRules[${currentIndex}].rangeTo`,
          message: 'Please add max deposit'
        });
      }

      return true;
    }

    // Find previous rules with same payment method
    const previousRulesWithSamePayment = parentArray
      .slice(0, currentIndex)
      .filter((rule) => (rule?.paymentMethod || 'all') === paymentMethod)
      .map((rule, idx) => ({ ...rule, originalIndex: idx }));

    if (previousRulesWithSamePayment.length === 0) return true;

    // Sort by rangeFrom to find the last (highest) range
    const sortedPrevious = [...previousRulesWithSamePayment];

    const lastPreviousRule = sortedPrevious[sortedPrevious.length - 1];
    const previousTo = lastPreviousRule.rangeTo;

    // If previous rule has a rangeTo, current rangeFrom must equal it
    if (
      !isNaN(Number(previousTo)) &&
      previousTo !== null &&
      previousTo !== undefined &&
      previousTo !== ''
    ) {
      const numCurrentFrom = Number(currentFrom);
      const numPreviousTo = Number(previousTo);
      if (numCurrentFrom !== numPreviousTo) {
        return this.createError({
          path: `variableRules[${currentIndex}].rangeFrom`,
          message: `Range must start from ${previousTo} to maintain continuity with previous range`
        });
      }
    }

    // Check if rangeTo is required (not last rule with same payment method)
    const lastRuleWithSamePayment = parentArray
      .filter(
        (rule) => (rule?.paymentMethod || 'all') === paymentMethod && rule?.mapIndex < currentIndex
      )
      .pop();

    const numCurrentFrom = currentFrom;
    if (!lastRuleWithSamePayment?.rangeTo && numCurrentFrom > 0) {
      return this.createError({
        path: `variableRules[${lastRuleWithSamePayment.mapIndex}].rangeTo`,
        message: 'Please add max deposit'
      });
    }

    return true;
  });

// Step 1: Template Info
export const templateInfoSchema = Yup.object().shape({
  templateName: Yup.string().trim().nullable().required('Template name is required'),
  bonusType: Yup.string().nullable().required('Bonus type is required'),
  bonusTag: Yup.array().of(Yup.string()).nullable(),
  expiryAfterIssuanceDays: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .required('Expiry days is required')
    .min(0, 'Expiry days must be 0 or greater')
    .max(365, 'Expiry days must be 365 or less')
    .integer('Expiry days must be a whole number')
    .typeError('Expiry days must be a valid number')
});

// Step 2: Bonus Details
export const bonusDetailsSchema = Yup.object().shape({
  displayTitle: Yup.string().trim().nullable().required('Bonus name is required'),
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
  desktopImage: Yup.mixed()
    .test('file-type', 'File must be PNG or JPG', (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return true; // Existing file path
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      return validTypes.includes(value?.type?.toLowerCase());
    })
    .test('file-size', 'Image must be exactly 1024x1024px', function (value) {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return true; // Existing file path, skip validation
      if (!(value instanceof File)) return true;

      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(value);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const isValid = img.naturalWidth === 1024 && img.naturalHeight === 1024;
          if (!isValid) {
            resolve(
              this.createError({
                message: 'Image must be exactly 1024x1024px'
              })
            );
          } else {
            resolve(true);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(
            this.createError({
              message: 'Invalid image file'
            })
          );
        };

        img.src = objectUrl;
      });
    })
    .nullable()
    .required('Desktop image is required'),
  mobileImage: Yup.mixed()
    .test('file-type', 'File must be PNG or JPG', (value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return true; // Existing file path
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      return validTypes.includes(value?.type?.toLowerCase());
    })
    .test('file-size', 'Image must be exactly 1024x1024px', function (value) {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return true; // Existing file path, skip validation
      if (!(value instanceof File)) return true;
      console.log('value: ', value);
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(value);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const isValid = img.naturalWidth === 1024 && img.naturalHeight === 1024;
          if (!isValid) {
            resolve(
              this.createError({
                message: 'Image must be exactly 1024x1024px'
              })
            );
          } else {
            resolve(true);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(
            this.createError({
              message: 'Invalid image file'
            })
          );
        };

        img.src = objectUrl;
      });
    })
    .nullable()
    .required('Mobile image is required')
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
    .when('$bonusType', {
      is: (val) => val === 'deposit_boost',
      then: (schema) =>
        schema.when('$boostMode', {
          is: (bm) => bm === 'fixed',
          then: (inner) =>
            inner
              .min(0, 'Boost percentage must be 0 or greater')
              .max(100, 'Boost percentage cannot exceed 100')
              .typeError('Boost percentage must be a valid number'),
          otherwise: (inner) => inner.nullable()
        }),
      otherwise: (schema) => schema.nullable()
    }),
  minDepositAmount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .when('$bonusType', {
      is: (val) => val === 'deposit_boost',
      then: (schema) =>
        schema.when('$boostMode', {
          is: (bm) => bm === 'fixed',
          then: (inner) =>
            inner
              .required('Minimum deposit amount is required')
              .moreThan(0, 'Minimum deposit amount must be greater than 0')
              .typeError('Minimum deposit amount must be a valid number'),
          otherwise: (inner) => inner.nullable()
        }),
      otherwise: (schema) => schema.nullable()
    }),
  // Deposit Boost - Variable
  maxBonusAmount: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .when('$bonusType', {
      is: (val) => val === 'deposit_boost',
      then: (schema) =>
        schema.when('$boostMode', {
          is: (bm) => bm === 'variable',
          then: (inner) =>
            inner
              .required('Max bonus amount is required')
              .min(0, 'Max bonus amount must be 0 or greater')
              .typeError('Max bonus amount must be a valid number'),
          otherwise: (inner) => inner.nullable()
        }),
      otherwise: (schema) => schema.nullable()
    }),
  variableRules: Yup.mixed().when('$bonusType', {
    is: (val) => val === 'deposit_boost',
    then: () =>
      Yup.mixed().when('$boostMode', {
        is: (bm) => bm === 'variable',
        then: () =>
          Yup.array().of(variableRuleItemSchema).nullable().min(1, 'Please add at least one rule'),
        otherwise: () => Yup.mixed().nullable()
      }),
    otherwise: () => Yup.mixed().nullable()
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
    .when('$bonusType', {
      is: (val) => val === 'free_spins',
      then: (schema) => schema.required('Max free spin winnings is required'),
      otherwise: (schema) => schema
    })
    .min(0, 'Max free spin winnings must be 0 or greater')
    .typeError('Max free spin winnings must be a valid number')
});

// Step 4: Wagering Configuration
export const wageringConfigSchema = Yup.object().shape({
  mode: Yup.string().nullable(),
  base: Yup.string()
    .nullable()
    .when('mode', {
      is: (val) => val === 'multiplier',
      then: (schema) => schema.required('Please select any one'),
      otherwise: (schema) => schema.nullable()
    }),
  wageringValue: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .min(0, 'Wagering value must be 0 or greater')
    .typeError('Wagering value must be a valid number'),
  daysToWager: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue);
    })
    .nullable()
    .when('mode', {
      is: (val) => val && val !== 'none',
      then: (schema) =>
        schema
          .required('Days to wager is required')
          .moreThan(0, 'Days to wager must be greater than 0')
          .max(365, 'Days to wager must be 365 or less')
          .integer('Days to wager must be a whole number')
          .typeError('Days to wager must be a valid number'),
      otherwise: (schema) => schema.nullable()
    })
});

// Step 5: Max Cashout Configuration
export const maxCashoutConfigSchema = Yup.object().shape({
  mode: Yup.string().nullable(),
  base: Yup.string()
    .nullable()
    .when('mode', {
      is: (val) => val === 'multiplier',
      then: (schema) => schema.required('Please select any one'),
      otherwise: (schema) => schema.nullable()
    }),
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

// export const variableRulesSchema = Yup.object().shape({

// });

// All step schemas mapped to step IDs
export const stepSchemas = {
  templateInfo: templateInfoSchema,
  bonusDetails: bonusDetailsSchema,
  rewardDetails: rewardDetailsSchema,
  wageringConfiguration: wageringConfigSchema,
  maxCashoutConfiguration: maxCashoutConfigSchema,
  gameplayConfiguration: gameplaySchema
};
