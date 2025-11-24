import { getDateInUTCToTimeZone } from 'helpers/functions';

export const translator = (t, text, ns) => t(`${text}`, { ns });

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
        moduleName: item.ModuleName,
        permissionSlug: permission.SlugName,
        requiredPermissions: permission.RequiredPermissions || []
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
  const resultData = apiData.map((data) => ({
    id: data.RoleID,
    roleName: data.RoleName,
    createBy: data.Username,
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};
