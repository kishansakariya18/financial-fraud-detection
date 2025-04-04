import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from '../../../../helpers/functions';

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

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.AdminID,
    adminUID: data.AdminUID,
    username: data.Username,
    firstname: data.FirstName,
    lastname: data.LastName,
    mobile: data.Mobile,
    role: data.Role,
    email: data.Email,
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    isMasterAdmin: data.MasterAdmin,
    lastLoginAt: data.LastLoginAt ? getDateInUTCToTimeZone(data.LastLoginAt) : '',
    status: parseAdminStatusToApp(data.Status)
  }));
  return resultData;
};

export const loginHistoryResponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.ID,
      adminId: data.AdminID,
      ip: data.Ip,
      userAgent: data.UserAgent,
      expiredAt: data.ExpiredAt,
      loginAt: data.DateCreated
    };
  });
};

export const adminDetailResponseMapper = (data) => {
  const resultData = {
    ...data,
    Status: parseAdminStatusToApp(data.Status),
    MasterAdmin: data.MasterAdmin ? 'yes' : 'no'
  };
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
