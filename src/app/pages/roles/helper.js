
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
      rolePermissionID: apiData.RolePermissionID,
      roleID: apiData.RoleID,
      roleName: apiData.RoleName,
      createBy: apiData.CreateBy,
      permissionIDs: apiData?.PermissionID?.split(',')?.map((item) => +item),
      status: apiData.Status,
    };
  };