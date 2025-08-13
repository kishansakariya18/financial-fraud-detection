// Import Dependencies
import { t } from 'i18next';
import * as yup from 'yup';

// ----------------------------------------------------------------------

export const createCurrencySchema = yup.object().shape({
  name: yup.string().required(t('Name is required')),
  code: yup.string().required(t('Code is required')),
  symbol: yup.string().required(t('Symbol is required')),
  decimal_places: yup
    .number()
    .typeError(t('Decimal places must be a number'))
    .required(t('Decimal Places is required'))
    .integer(t('Decimal places must be an integer'))
    .min(0, t('Decimal places must be 0 or greater'))
    .max(10, t('Decimal places cannot exceed 10'))
});

export const adminExchangeRateSchema = yup.object().shape({
  exchange_rate: yup
    .number()
    .typeError(t('Exchange rate must be a number'))
    .required(t('Exchange rate is required'))
    .positive(t('Exchange rate must be positive'))
});

export const currencySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  is_active: yup.boolean()
});
