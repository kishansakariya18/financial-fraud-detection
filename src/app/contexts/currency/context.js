import { createSafeContext } from 'utils/createSafeContext';

export const [CurrencyContext, useCurrencyContext] = createSafeContext(
  'useCurrencyContext must be used within CurrencyProvider'
);
