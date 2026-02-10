import { useSelector } from 'react-redux';

const usePermissions = () => {
  const isMasterAdmin = useSelector((state) => state.auth.isMasterAdmin);
  const permissions = useSelector((state) => state.auth.permissions);

  const hasPermission = (permission) => {
    let result = false;

    if (+isMasterAdmin === 1) {
      result = true;
    }

    if (
      (permission &&
        Array.isArray(permission) &&
        permission?.some((p) => permissions.includes(p))) ||
      permissions?.includes(permission)
    ) {
      result = true;
    }

    return result;
  };
  return { hasPermission };
};
export default usePermissions;
