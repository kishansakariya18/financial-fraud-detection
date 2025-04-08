import { PAYMENT_OPT } from 'constants/app.constant';
import { t } from 'i18next';

export const paymentOption = [
  { label: t('deposit'), value: PAYMENT_OPT.DEPOSIT },
  { label: t('withdraw'), value: PAYMENT_OPT.WITHDRAW },
  { label: t('winning'), value: PAYMENT_OPT.WINNING },
  { label: t('betslip'), value: PAYMENT_OPT.BETSLIP }
];

export const paymentStatusOption = [
  // { label: "Pending", value: 0 },
  { label: t('success', { ns: 'glossary' }), value: 1 },
  { label: t('failure', { ns: 'glossary' }), value: 2 }
];
