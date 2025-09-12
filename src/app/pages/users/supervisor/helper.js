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
    email: data.Email,
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    lastLoginAt: data.LastLoginAt ? getDateInUTCToTimeZone(data.LastLoginAt) : '',
    status: parseAdminStatusToApp(data.AccountStatus),
    // Add supervisor-specific fields
    hasSupervisorPermissions: data.HasSupervisorPermissions || false,
    assignedAgentsCount: data.AssignedAgentsCount || 0,
    // Create computed supervisorAccess field
    supervisorAccessTooltip: (() => {
      if (data.HasSupervisorPermissions) return null;
      if (!data.HasSupervisorPermissions && (data.AssignedAgentsCount || 0) > 0)
        return 'Agents are assigned, but this user lacks supervisor management permissions.';
      return 'This user has neither supervisor permissions nor assigned agents.';
    })()
  }));
  return resultData;
};

export const loginHistoryResponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.AdminLoginHistoryID,
      adminId: data.AdminID,
      ip: data.IPAddress,
      userAgent: data.UserAgent,
      expiredAt: data.ExpiredAt ? getDateInUTCToTimeZone(data.ExpiredAt) : '',
      loginAt: data.DateCreated ? getDateInUTCToTimeZone(data.DateCreated) : ''
    };
  });
};

export const adminDetailResponseMapper = (data) => {
  const resultData = {
    ...data,
    Status: parseAdminStatusToApp(data.Status),
    MasterAdmin: data.IsSuperAdmin ? 'yes' : 'no'
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
