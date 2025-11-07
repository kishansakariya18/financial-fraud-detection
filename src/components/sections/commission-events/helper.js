import { getDateInUTCToTimeZone } from 'helpers/functions';

export const EVENT_NAME = {
  DEPOSIT: 'deposit',
  WAGER: 'wager',
  LOSS: 'loss'
};

export const eventNameOptions = [
  { value: 'deposit', label: 'Deposit', color: 'success' },
  { value: 'wager', label: 'Wager', color: 'primary' },
  { value: 'loss', label: 'Loss', color: 'error' }
];

export const commissionEventsResponseMapper = (apiData) => {
  const totalRecords = apiData.total_records || apiData.totalRecords;
  const list = apiData?.data?.map((item) => {
    const player = item.Player;
    return {
      id: item.CallingAgentCommissionEventID,
      playerId: item.PlayerID,
      callingAgentId: item.CallingAgentID,
      eventName: item.EventName.toLowerCase(),
      eventAmount: item.EventAmount,
      eventDate: getDateInUTCToTimeZone(item.EventDate),
      player: player
        ? {
            id: player.UserID,
            userID: player.UserID,
            userUID: player.UserUID,
            username: player.Username,
            mobile: player.Mobile,
            email: player.Email,
            firstName: player.FirstName,
            lastName: player.LastName
          }
        : null,
      _originalData: item
    };
  });
  return {
    status: 200,
    data: list,
    totalRecords
  };
};
