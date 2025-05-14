import { getDateInUTCToTimeZone } from 'helpers/functions';

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.AuditLogID,
    username: data.Username,
    moduleName: data.ModuleName,
    eventName: data.EventName,
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  console.log('data >>>', resultData);

  return resultData;
};
