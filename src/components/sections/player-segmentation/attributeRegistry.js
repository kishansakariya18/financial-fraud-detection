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
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  BETWEEN: 'between'
};

export const DatetimeOperator = {
  LESS_THAN_X_AGO: 'less_than_x_ago',
  GREATER_THAN_X_AGO: 'greater_than_x_ago',
  BETWEEN_RELATIVE: 'between_relative',
  BETWEEN_DATE_RANGE: 'between_date_range',
  IS_NULL: 'is_null',
  IS_NOT_NULL: 'is_not_null'
};

export const BooleanOperator = {
  IS_TRUE: 'is_true',
  IS_FALSE: 'is_false'
};

export const EnumStringOperator = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  IN: 'in',
  NOT_IN: 'not_in'
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
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
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
  DatetimeOperator.BETWEEN_RELATIVE,
  DatetimeOperator.BETWEEN_DATE_RANGE,
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
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_AMOUNT]: {
    key: SegmentAttributeKey.DEPOSIT_AMOUNT,
    label: 'Deposit Amount',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.WITHDRAWAL_COUNT]: {
    key: SegmentAttributeKey.WITHDRAWAL_COUNT,
    label: 'Withdrawal Count',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.WITHDRAWAL_AMOUNT]: {
    key: SegmentAttributeKey.WITHDRAWAL_AMOUNT,
    label: 'Withdrawal Amount',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.NET_AMOUNT]: {
    key: SegmentAttributeKey.NET_AMOUNT,
    label: 'Net Amount',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_COUNT]: {
    key: SegmentAttributeKey.FREE_BONUS_COUNT,
    label: 'Free Bonus Count',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_AMOUNT]: {
    key: SegmentAttributeKey.FREE_BONUS_AMOUNT,
    label: 'Free Bonus Amount',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.FREE_BONUS_RATIO]: {
    key: SegmentAttributeKey.FREE_BONUS_RATIO,
    label: 'Free Bonus Ratio (%)',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_COUNT]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_COUNT,
    label: 'Deposit Bonus Count',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_AMOUNT]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_AMOUNT,
    label: 'Deposit Bonus Amount',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.CLEAN_DEPOSIT_RATIO]: {
    key: SegmentAttributeKey.CLEAN_DEPOSIT_RATIO,
    label: 'Clean Deposit Ratio (%)',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.DEPOSIT_BONUS_RATIO]: {
    key: SegmentAttributeKey.DEPOSIT_BONUS_RATIO,
    label: 'Deposit Bonus Ratio (%)',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },
  [SegmentAttributeKey.TOTAL_BONUS_RATIO]: {
    key: SegmentAttributeKey.TOTAL_BONUS_RATIO,
    label: 'Total Bonus Ratio (%)',
    dataType: 'numeric',
    supportedOperators: numericOperator
  },

  // DateTime Attributes
  [SegmentAttributeKey.SIGNUP_DATETIME]: {
    key: SegmentAttributeKey.SIGNUP_DATETIME,
    label: 'Signup Date',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.FIRST_DEPOSIT_TIME]: {
    key: SegmentAttributeKey.FIRST_DEPOSIT_TIME,
    label: 'First Deposit Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_DEPOSIT_TIME]: {
    key: SegmentAttributeKey.LAST_DEPOSIT_TIME,
    label: 'Last Deposit Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_LOGIN_TIME]: {
    key: SegmentAttributeKey.LAST_LOGIN_TIME,
    label: 'Last Login Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_BONUS_CLAIM_TIME]: {
    key: SegmentAttributeKey.LAST_BONUS_CLAIM_TIME,
    label: 'Last Bonus Claim Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_BONUS_CLAIM_TIME]: {
    key: SegmentAttributeKey.LAST_BONUS_CLAIM_TIME,
    label: 'Last Bonus Claim Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },
  [SegmentAttributeKey.LAST_ACTIVITY_TIME]: {
    key: SegmentAttributeKey.LAST_ACTIVITY_TIME,
    label: 'Last Activity Time',
    dataType: 'datetime',
    supportedOperators: datetimeOperator
  },

  // Boolean Attributes
  [SegmentAttributeKey.EMAIL_VERIFIED]: {
    key: SegmentAttributeKey.EMAIL_VERIFIED,
    label: 'Email Verified',
    dataType: 'boolean',
    supportedOperators: booleanOperator
  },
  [SegmentAttributeKey.PHONE_VERIFIED]: {
    key: SegmentAttributeKey.PHONE_VERIFIED,
    label: 'Phone Verified',
    dataType: 'boolean',
    supportedOperators: booleanOperator
  },
  [SegmentAttributeKey.KYC_VERIFIED]: {
    key: SegmentAttributeKey.KYC_VERIFIED,
    label: 'KYC Verified',
    dataType: 'boolean',
    supportedOperators: booleanOperator
  },

  // Enum/String Attributes
  [SegmentAttributeKey.ACCOUNT_STATUS]: {
    key: SegmentAttributeKey.ACCOUNT_STATUS,
    label: 'Account Status',
    dataType: 'enum',
    supportedOperators: enumStringOperator,
    options: [
      { value: AccountStatus.ACTIVE, label: 'Active' },
      { value: AccountStatus.INACTIVE, label: 'Inactive' },
      { value: AccountStatus.BLOCKED, label: 'Blocked' }
    ]
  },
  [SegmentAttributeKey.COUNTRY]: {
    key: SegmentAttributeKey.COUNTRY,
    label: 'Country',
    dataType: 'string',
    supportedOperators: enumStringOperator
  },
  [SegmentAttributeKey.CURRENCY]: {
    key: SegmentAttributeKey.CURRENCY,
    label: 'Currency',
    dataType: 'string',
    supportedOperators: enumStringOperator
  },
  [SegmentAttributeKey.AFFILIATE]: {
    key: SegmentAttributeKey.AFFILIATE,
    label: 'Affiliate',
    dataType: 'string',
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
  [DatetimeOperator.BETWEEN_RELATIVE]: 'Between (Relative)',
  [DatetimeOperator.BETWEEN_DATE_RANGE]: 'Between (Date Range)',
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
  Object.values(attributeRegistry).map((attr) => ({
    value: attr.key,
    label: attr.label
  }));

export const getOperatorOptions = (attributeKey) => {
  const attribute = getAttribute(attributeKey);
  if (!attribute) return [];

  return attribute.supportedOperators.map((op) => ({
    value: op,
    label: operatorLabels[op] || op
  }));
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
