// Attribute Registry for Player Segmentation Rules
// Defines all available attributes, their data types, and supported operators

// Attribute Keys
export const SegmentAttributeKey = {
  // Deposit & Withdrawal
  DEPOSIT_COUNT: 'deposit_count',
  DEPOSIT_AMOUNT: 'deposit_amount',
  WITHDRAWAL_COUNT: 'withdrawal_count',
  WITHDRAWAL_AMOUNT: 'withdrawal_amount',
  NET_AMOUNT: 'net_amount',

  // Bonus
  FREE_BONUS_COUNT: 'free_bonus_count',
  FREE_BONUS_AMOUNT: 'free_bonus_amount',
  FREE_BONUS_RATIO: 'free_bonus_ratio',
  DEPOSIT_BONUS_COUNT: 'deposit_bonus_count',
  DEPOSIT_BONUS_AMOUNT: 'deposit_bonus_amount',
  CLEAN_DEPOSIT_RATIO: 'clean_deposit_ratio',
  DEPOSIT_BONUS_RATIO: 'deposit_bonus_ratio',
  TOTAL_BONUS_RATIO: 'total_bonus_ratio',

  // Account Info
  SIGNUP_DATETIME: 'signup_datetime',
  ACCOUNT_STATUS: 'account_status',
  COUNTRY: 'country',
  CURRENCY: 'currency',
  EMAIL_VERIFIED: 'email_verified',
  PHONE_VERIFIED: 'phone_verified',
  KYC_VERIFIED: 'kyc_verified',
  AFFILIATE: 'affiliate',

  // Timestamps
  FIRST_DEPOSIT_TIME: 'first_deposit_time',
  LAST_DEPOSIT_TIME: 'last_deposit_time',
  LAST_LOGIN_TIME: 'last_login_time',
  LAST_BONUS_CLAIM_TIME: 'last_bonus_claim_time',
  LAST_ACTIVITY_TIME: 'last_activity_time'
};

// Operator Keys by Type
export const NumericOperator = {
  EQUALS: '=',
  NOT_EQUALS: '!=',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  BETWEEN: 'between'
};

export const DatetimeOperator = {
  LESS_THAN_X_AGO: '< x ago',
  GREATER_THAN_X_AGO: '> x ago',
  BETWEEN: 'between', // Relative time range: between X and Y ago
  IN_RANGE: 'in_range', // Absolute date range
  IS_NULL: 'is_null',
  IS_NOT_NULL: 'is_not_null'
};

export const BooleanOperator = {
  IS_TRUE: 'is_true',
  IS_FALSE: 'is_false'
};

export const EnumStringOperator = {
  EQUALS: '=',
  NOT_EQUALS: '!=',
  IN: 'in',
  NOT_IN: 'not_in'
};

export const ValueInputType = {
  NUMBER: 'number',
  DATETIME: 'datetime',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
  AUTOCOMPLETE: 'autocomplete',
  TAG_INPUT: 'tag-input'
};

// Time Units for Relative Date Operations
export const TimeUnit = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months'
};

// Account Status Options
export const AccountStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  BLOCKED: 2
};

const numericOperator = [
  NumericOperator.EQUALS,
  NumericOperator.NOT_EQUALS,
  NumericOperator.GREATER_THAN,
  NumericOperator.LESS_THAN,
  NumericOperator.BETWEEN
];

const datetimeOperator = [
  DatetimeOperator.LESS_THAN_X_AGO,
  DatetimeOperator.GREATER_THAN_X_AGO,
  DatetimeOperator.BETWEEN,
  DatetimeOperator.IN_RANGE,
  DatetimeOperator.IS_NULL,
  DatetimeOperator.IS_NOT_NULL
];

const booleanOperator = [BooleanOperator.IS_TRUE, BooleanOperator.IS_FALSE];

const enumStringOperator = [
  EnumStringOperator.EQUALS,
  EnumStringOperator.NOT_EQUALS,
  EnumStringOperator.IN,
  EnumStringOperator.NOT_IN
];

// Attribute Registry - Central metadata for all attributes
export const attributeRegistry = {
  // Numeric Attributes
  [SegmentAttributeKey.DEPOSIT_COUNT]: {
    key: SegmentAttributeKey.DEPOSIT_COUNT,
    label: 'Deposit Count',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_AMOUNT]: {
    key: SegmentAttributeKey.DEPOSIT_AMOUNT,
    label: 'Deposit Amount',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.WITHDRAWAL_COUNT]: {
    key: SegmentAttributeKey.WITHDRAWAL_COUNT,
    label: 'Withdrawal Count',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.WITHDRAWAL_AMOUNT]: {
    key: SegmentAttributeKey.WITHDRAWAL_AMOUNT,
    label: 'Withdrawal Amount',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.NET_AMOUNT]: {
    key: SegmentAttributeKey.NET_AMOUNT,
    label: 'Net Amount',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_COUNT]: {
    key: SegmentAttributeKey.FREE_BONUS_COUNT,
    label: 'Free Bonus Count',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_AMOUNT]: {
    key: SegmentAttributeKey.FREE_BONUS_AMOUNT,
    label: 'Free Bonus Amount',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_RATIO]: {
    key: SegmentAttributeKey.FREE_BONUS_RATIO,
    label: 'Free Bonus Ratio (%)',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_COUNT]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_COUNT,
    label: 'Deposit Bonus Count',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_AMOUNT]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_AMOUNT,
    label: 'Deposit Bonus Amount',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.CLEAN_DEPOSIT_RATIO]: {
    key: SegmentAttributeKey.CLEAN_DEPOSIT_RATIO,
    label: 'Clean Deposit Ratio (%)',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_RATIO]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_RATIO,
    label: 'Deposit Bonus Ratio (%)',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.TOTAL_BONUS_RATIO]: {
    key: SegmentAttributeKey.TOTAL_BONUS_RATIO,
    label: 'Total Bonus Ratio (%)',
    dataType: 'numeric',
    inputType: ValueInputType.NUMBER,
    supportedOperators: numericOperator
  },

  // DateTime Attributes
  [SegmentAttributeKey.SIGNUP_DATETIME]: {
    key: SegmentAttributeKey.SIGNUP_DATETIME,
    label: 'Signup Date',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.FIRST_DEPOSIT_TIME]: {
    key: SegmentAttributeKey.FIRST_DEPOSIT_TIME,
    label: 'First Deposit Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_DEPOSIT_TIME]: {
    key: SegmentAttributeKey.LAST_DEPOSIT_TIME,
    label: 'Last Deposit Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_LOGIN_TIME]: {
    key: SegmentAttributeKey.LAST_LOGIN_TIME,
    label: 'Last Login Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_BONUS_CLAIM_TIME]: {
    key: SegmentAttributeKey.LAST_BONUS_CLAIM_TIME,
    label: 'Last Bonus Claim Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_BONUS_CLAIM_TIME]: {
    key: SegmentAttributeKey.LAST_BONUS_CLAIM_TIME,
    label: 'Last Bonus Claim Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_ACTIVITY_TIME]: {
    key: SegmentAttributeKey.LAST_ACTIVITY_TIME,
    label: 'Last Activity Time',
    dataType: 'datetime',
    inputType: ValueInputType.DATETIME,
    supportedOperators: datetimeOperator
  },

  // Boolean Attributes
  [SegmentAttributeKey.EMAIL_VERIFIED]: {
    key: SegmentAttributeKey.EMAIL_VERIFIED,
    label: 'Email Verified',
    dataType: 'boolean',
    inputType: ValueInputType.BOOLEAN,
    supportedOperators: booleanOperator
  },
  [SegmentAttributeKey.PHONE_VERIFIED]: {
    key: SegmentAttributeKey.PHONE_VERIFIED,
    label: 'Phone Verified',
    dataType: 'boolean',
    inputType: ValueInputType.BOOLEAN,
    supportedOperators: booleanOperator
  },
  [SegmentAttributeKey.KYC_VERIFIED]: {
    key: SegmentAttributeKey.KYC_VERIFIED,
    label: 'KYC Verified',
    dataType: 'boolean',
    inputType: ValueInputType.BOOLEAN,
    supportedOperators: booleanOperator
  },

  // Enum/String Attributes
  [SegmentAttributeKey.ACCOUNT_STATUS]: {
    key: SegmentAttributeKey.ACCOUNT_STATUS,
    label: 'Account Status',
    dataType: 'enum',
    inputType: ValueInputType.ENUM,
    supportedOperators: enumStringOperator,
    options: [
      { value: AccountStatus.ACTIVE, label: 'Active' },
      { value: AccountStatus.BLOCKED, label: 'Blocked' }
    ]
  },
  [SegmentAttributeKey.COUNTRY]: {
    key: SegmentAttributeKey.COUNTRY,
    label: 'Country',
    dataType: 'enum',
    inputType: ValueInputType.AUTOCOMPLETE,
    supportedOperators: enumStringOperator
  },
  [SegmentAttributeKey.CURRENCY]: {
    key: SegmentAttributeKey.CURRENCY,
    label: 'Currency',
    dataType: 'enum',
    inputType: ValueInputType.AUTOCOMPLETE,
    supportedOperators: enumStringOperator
  },
  [SegmentAttributeKey.AFFILIATE]: {
    key: SegmentAttributeKey.AFFILIATE,
    label: 'Affiliate',
    dataType: 'string',
    inputType: ValueInputType.AUTOCOMPLETE,
    supportedOperators: enumStringOperator
  }
};

// Operator Labels
export const operatorLabels = {
  // Numeric
  [NumericOperator.EQUALS]: 'Equals',
  [NumericOperator.NOT_EQUALS]: 'Not Equals',
  [NumericOperator.GREATER_THAN]: 'Greater Than',
  [NumericOperator.LESS_THAN]: 'Less Than',
  [NumericOperator.BETWEEN]: 'Between',

  // Datetime
  [DatetimeOperator.LESS_THAN_X_AGO]: 'Less Than X Ago',
  [DatetimeOperator.GREATER_THAN_X_AGO]: 'Greater Than X Ago',
  [DatetimeOperator.BETWEEN]: 'Between (Relative)',
  [DatetimeOperator.IN_RANGE]: 'In Range',
  [DatetimeOperator.IS_NULL]: 'Is Null',
  [DatetimeOperator.IS_NOT_NULL]: 'Is Not Null',

  // Boolean
  [BooleanOperator.IS_TRUE]: 'Is True',
  [BooleanOperator.IS_FALSE]: 'Is False',

  // Enum/String
  [EnumStringOperator.IN]: 'In',
  [EnumStringOperator.NOT_IN]: 'Not In'
};

// Time Unit Labels
export const timeUnitLabels = {
  [TimeUnit.MINUTES]: 'Minutes',
  [TimeUnit.HOURS]: 'Hours',
  [TimeUnit.DAYS]: 'Days',
  [TimeUnit.WEEKS]: 'Weeks',
  [TimeUnit.MONTHS]: 'Months'
};

// Helper Functions
export const getAttribute = (key) => attributeRegistry[key] || null;

export const getAttributeOptions = () =>
  Object.values(attributeRegistry)
    .map((attr) => ({
      value: attr.key,
      label: attr.label
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const getOperatorOptions = (attributeKey) => {
  const attribute = getAttribute(attributeKey);
  if (!attribute) return [];

  return attribute.supportedOperators.map((op) => {
    let label = operatorLabels[op] || op;
    // Customize "Between" label based on data type
    if (op === 'between') {
      if (attribute.dataType === 'numeric') {
        label = 'Between';
      } else if (attribute.dataType === 'datetime') {
        label = 'Between (Relative)';
      }
    }
    return {
      value: op,
      label: label
    };
  });
};

export const getTimeUnitOptions = () =>
  Object.values(TimeUnit).map((unit) => ({
    value: unit,
    label: timeUnitLabels[unit]
  }));

export const requiresValue = (operator) => {
  return ![
    BooleanOperator.IS_TRUE,
    BooleanOperator.IS_FALSE,
    DatetimeOperator.IS_NULL,
    DatetimeOperator.IS_NOT_NULL
  ].includes(operator);
};
