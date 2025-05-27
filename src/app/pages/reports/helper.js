import { getDateInUTCToTimeZone } from 'helpers/functions';
import { playerStatusToApp, transactionStatusToAPP } from '../users/player/helper';

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
    case 0:
      return 'betplaced';
    case 1:
      return 'result';
    default:
      break;
  }
};
export const getStageAppToApi = (type) => {
  switch (type) {
    case 'betplaced':
      return 0;
    case 'result':
      return 1;
    default:
      break;
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
    id: data.ID,
    userId: data.UserID,
    betPlacementId: data.BetPlacementTransactionID,
    username: data.Username,
    mobile: data.Mobile,
    betAmount: data.BetAmount,
    stage: getBatdgeForStage(data.Stage),
    betWinningTxnId: data.BetWinningTransactionID,
    resultDate: data.ResultDate ? data.ResultDate : '',
    winAmount: data.WinningAmount || '-',
    userAmount: amountColorBasedOnType(data.Amount, data.OutcomeType),
    platformAmount: amountColorBasedOnTypeForPlatform(data.Amount, data.OutcomeType),
    type: getBatdgeForType(data.OutcomeType),
    platformType: getBadgeForPlatform(data.OutcomeType),
    createdAt: getDateInUTCToTimeZone(data.Date)
  }));
  return resultData;
};
export const depositTransactionResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.TransactionID,
    transactionUID: data.TransactionUID,
    userId: data.user.UserID,
    username: data.user.Username,
    mobile: data.user.Mobile,
    amount: parseFloat(data.RealCash) + parseFloat(data.Winning),
    status: transactionStatusToAPP(data.TransactionStatus),
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
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
  switch (type) {
    case 'profit':
      return type;
    case 'loss':
      return type;
    case 'not-decided':
      return type;
    default:
      return 'not-decided';
  }
};
export const getBadgeForPlatform = (type) => {
  switch (type) {
    case 'profit':
      return 'loss';
    case 'loss':
      return 'profit';
    case 'not-decided':
      return type;
    default:
      return 'not-decided';
  }
};
export const amountColorBasedOnType = (amount, type) => {
  switch (type) {
    case 'loss':
      return `- ${amount}`;
    case 'profit':
      return `+ ${amount}`;
    default:
      return `${amount}`;
  }
};
export const amountColorBasedOnTypeForPlatform = (amount, type) => {
  switch (type) {
    case 'loss':
      return `+ ${amount}`;
    case 'profit':
      return `- ${amount}`;
    default:
      return `${amount}`;
  }
};
export const stageOptions = [
  {
    value: 'betplaced',
    label: 'Betplaced',
    color: 'success'
  },
  {
    value: 'result',
    label: 'Result',
    color: 'success'
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
