import { ADMIN_TYPE } from 'constants/app.constant';
import { useSelector } from 'react-redux';

const usePermissions = () => {
  const isMasterAdmin = useSelector((state) => state.auth.isMasterAdmin);
  const permissions = useSelector((state) => state.auth.permissions);
  const { userData } = useSelector((state) => state.auth);

  const hasPermission = (permission, allowOptions = {}) => {
    let result = false;

    if (allowOptions?.isAllowCallingAgent && userData?.AdminType === ADMIN_TYPE.AGENT) {
      result = true;
    }
    if (allowOptions?.isAllowB2BAgent && userData?.AgentUID) {
      result = true;
    }

    if (permissions?.includes(permission) || +isMasterAdmin === 1) {
      result = true;
    }

    return result;
  };
  return { hasPermission };
};
export default usePermissions;
