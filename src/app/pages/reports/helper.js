import {
  playerStatusToApp,
  transactionStatusToAPP
} from 'components/sections/player-management/helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const parseAdminStatusToApp = (status) => (status ? 'active' : 'inactive');

export const parseAdminStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });
export const getBatdgeForStage = (type) => {
  switch (+type) {
    case 1:
      return 'result';
    case 2:
      return 'rollback';
    default:
      return 'result';
  }
};
export const getStageAppToApi = (type) => {
  switch (type) {
    // case 'betplaced':
    //   return 0;
    case 'result':
      return 1;
    case 'rollback':
      return 2;
    default:
      return 1;
  }
};
export const mapType = (item) => {
  switch (item) {
    case 'profit':
      return 1;
    case 'loss':
      return 2;
    case 'neutral':
      return 3;
    default:
      return 0;
  }
};
export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.UserBetOutcomeID,
    userId: data.UserID,
    betPlacementId: data.BetPlacementTransactionID,
    gameName: data.GameName,
    username: data.Username,
    mobile: data.Mobile,
    betAmount: data.BetAmount,
    stage: getBatdgeForStage(data.Stage),
    betWinningTxnId: data.BetWinningTransactionID,
    resultDate: data.ResultDate ? data.ResultDate : '',
    winAmount: data.WinningAmount,
    userAmount: amountColorBasedOnType(data.Amount, data.OutcomeType),
    platformAmount: amountColorBasedOnTypeForPlatform(data.Amount, data.OutcomeType),
    type: getBatdgeForType(data.OutcomeType),
    platformType: getBadgeForPlatform(data.OutcomeType),
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    currencyCode: data.Currency != null ? data.Currency.code : '-',
    currencySymbol: data.Currency != null ? data.Currency.symbol : '-'
  }));
  return resultData;
};
export const depositTransactionResponseMapper = (apiData) => {
  console.log('apiData: ', apiData);
  const resultData = apiData.map((data) => ({
    id: data.TransactionID,
    transactionUID: data.TransactionUID,
    userId: data.UserID,
    username: data.Username,
    mobile: data.Mobile,
    amount: parseFloat(data.TransactionAmount),
    status: transactionStatusToAPP(data.TransactionStatus),
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    currencyCode: data.Currency != null ? data.Currency.Code : '-',
    currencySymbol: data.Currency != null ? data.Currency.Symbol : '-',
    baseCurrencyRate:
      data.BaseCurrencyRate != null && data.BaseCurrencyRate >= 0 ? data.BaseCurrencyRate : '-',
    BaseCurrencyValue:
      data.BaseCurrencyValue != null && data.BaseCurrencyValue >= 0 ? data.BaseCurrencyValue : '-'
  }));
  return resultData;
};
export const playerBalanceResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.UserID,
    userUID: data.UserUID,
    username: data.Username,
    mobile: data.Mobile,
    realCash: data.RealCash,
    winning: data.Winning,
    bonus: data.Bonus,
    status: playerStatusToApp(data.AccountStatus),
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};
export const getBatdgeForType = (type) => {
  switch (+type) {
    case 1:
      return 'profit';
    case 2:
      return 'loss';
    case 3:
      return 'not-decided';
    default:
      return 'not-decided';
  }
};
export const getBadgeForPlatform = (type) => {
  switch (+type) {
    case 1:
      return 'loss';
    case 2:
      return 'profit';
    case 3:
      return 'not-decided';
    default:
      return 'not-decided';
  }
};
export const amountColorBasedOnType = (amount, type) => {
  switch (+type) {
    case 2:
      return `- ${amount}`;
    case 1:
      return `+ ${amount}`;
    default:
      return `${amount}`;
  }
};
export const amountColorBasedOnTypeForPlatform = (amount, type) => {
  switch (+type) {
    case 2:
      return `+ ${amount}`;
    case 1:
      return `- ${amount}`;
    default:
      return `${amount}`;
  }
};
export const stageOptions = [
  {
    value: 'result',
    label: 'Result',
    color: 'success'
  },
  {
    value: 'rollback',
    label: 'Rollback',
    color: 'warning'
  }
];
export const typeOptions = [
  {
    value: 'profit',
    label: 'Profit',
    color: 'success'
  },
  {
    value: 'loss',
    label: 'Loss',
    color: 'error'
  },
  {
    value: 'not-decided',
    label: 'Neutral',
    color: 'warning'
  }
];
