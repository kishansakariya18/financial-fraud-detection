export const TRANSACTION_TYPES = [
  { value: 'INCOME', label: 'Income' },
  { value: 'EXPENSE', label: 'Expense' }
];

export const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'WALLET', label: 'Wallet' }
];

export const FRAUD_STATUS = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'SAFE', label: 'Safe', color: 'success' },
  { value: 'FLAGGED', label: 'Flagged', color: 'error' },
  { value: 'CONFIRMED_FRAUD', label: 'Confirmed Fraud', color: 'error' }
];

export const TRANSACTION_CATEGORIES = [
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health_wellness', label: 'Health & Wellness' },
  { value: 'salary', label: 'Salary' },
  { value: 'investment', label: 'Investment' },
  { value: 'rent_utilities', label: 'Rent & Utilities' },
  { value: 'others', label: 'Others' }
];
