export const commissionTypes = [
  { value: 'turnover', label: 'Turnover' },
  { value: 'cpa', label: 'CPA (Cost Per Acquisition)' }
];

export const cpaTriggerOptions = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'bet', label: 'Bet' },
  { value: 'both', label: 'Both Deposit & Bet' }
];

// Configuration for each commission type fields
export const commissionFieldConfig = {
  turnover: {
    fields: ['turnoverPercent', 'turnoverTargetAmount'],
    requiredFields: ['turnoverPercent', 'turnoverTargetAmount']
  },
  cpa: {
    fields: ['cpaPayoutAmount', 'cpaTrigger'],
    requiredFields: ['cpaPayoutAmount', 'cpaTrigger']
  }
};

// Get CPA fields based on trigger type
export const getCpaFieldsByTrigger = (trigger) => {
  const baseFields = ['cpaPayoutAmount', 'cpaTrigger'];

  switch (trigger) {
    case 'deposit':
      return [...baseFields, 'cpaDepositMinAmount'];
    case 'bet':
      return [...baseFields, 'cpaBetMinAmount'];
    case 'both':
      return [...baseFields, 'cpaDepositMinAmount', 'cpaBetMinAmount'];
    default:
      return baseFields;
  }
};

// Default values for new commission
export const getDefaultCommission = (type) => {
  const base = {
    CommissionType: type
  };

  switch (type) {
    case 'turnover':
      return {
        ...base,
        turnoverPercent: null,
        turnoverTargetAmount: null
      };
    case 'cpa':
      return {
        ...base,
        cpaPayoutAmount: null,
        cpaDepositMinAmount: null,
        cpaBetMinAmount: null,
        cpaTrigger: 'deposit'
      };
    default:
      return base;
  }
};
