import { getDateInUTCToTimeZone } from 'helpers/functions';

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  let i = 1;
  const resultData = apiData.map((data) => ({
    id: data.auditLogsList,
    srn: i++,
    username: data.Username,
    moduleName: data.ModuleName,
    eventName: data.EventName,
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));

  return resultData;
};
