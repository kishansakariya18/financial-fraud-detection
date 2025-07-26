import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { GENERAL_STATUS } from 'constants/app.constant';

export const parseRateLimitRuleStatusToApp = (status) =>
  +status === GENERAL_STATUS.ACTIVE ? 'active' : 'inactive';

export const parseRateLimitRuleStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = GENERAL_STATUS.INACTIVE;
  } else if (status === 'active') {
    apiStatus = GENERAL_STATUS.ACTIVE;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    rateLimitID: data.RateLimitID,
    rateLimitUID: data.RateLimitUID,
    action: data.Action,
    label: data.Label,
    applicationTo: data.ApplicableTo,
    blockMinutes: data.BlockMinutes,
    windowMinutes: data.WindowMinutes,
    maxAttempts: data.MaxAttempts,
    description: data.Description,
    dateCreated: getDateInUTCToTimeZone(data.DateCreated),
    dateModified: getDateInUTCToTimeZone(data.DateModified),
    isActive: parseRateLimitRuleStatusToApp(data.IsActive)
  }));
  return resultData;
};

export const statusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];
