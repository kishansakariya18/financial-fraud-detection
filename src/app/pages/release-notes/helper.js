import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const parseReleaseNoteStatus = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
    default:
      return 'not found';
  }
};

export const rolePermissionListMapper = (apiData) => {
  const list = apiData?.map((item) => {
    const permissionList = item?.permission?.map((permission) => {
      return {
        permissionID: permission.PermissionID,
        moduleID: permission.ModuleID,
        permissionName: permission.PermissionName,
        createBy: permission.CreateBy,
        username: permission.Username,
        status: permission.Status,
        moduleName: item.ModuleName
      };
    });
    return {
      moduleName: item.ModuleName,
      permissionList
    };
  });
  return list;
};

export const roleDetailMapper = (apiData) => {
  return {
    roleID: apiData.RoleID,
    roleName: apiData.RoleName,
    permissionIDs: apiData?.PermissionID,
    status: apiData.Status
  };
};

export const responseMapper = (apiData) => {
  const resultData = apiData.map((releaseNote) => ({
    releaseNoteUID: releaseNote.ReleaseNoteUID,
    version: releaseNote.Version,
    title: releaseNote.Title,
    description: releaseNote.Description,
    releaseDate: getDateInUTCToTimeZone(releaseNote.ReleaseDate),
    status: parseReleaseNoteStatus(releaseNote.IsActive),
    createdAt: getDateInUTCToTimeZone(releaseNote.DateCreated),
    modifiedAt: getDateInUTCToTimeZone(releaseNote.DateModified)
  }));
  return resultData;
};
export const releaseNoteStatusOption = [
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
