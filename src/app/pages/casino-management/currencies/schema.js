// Import Dependencies
import { t } from 'i18next';
import * as yup from 'yup';

// ----------------------------------------------------------------------

export const createCurrencySchema = yup.object().shape({
  name: yup.string().required(t('name_is_required')),
  code: yup.string().required(t('code_is_required')),
  symbol: yup.string().required(t('symbol_is_required')),
  exchange_rate: yup
    .number()
    .typeError(t('exchange_rate_must_be_a_number'))
    .required(t('exchange_rate_is_required'))
    .positive(t('exchange_rate_must_be_positive'))
});

export const currencySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  is_active: yup.boolean()
});
