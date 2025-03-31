import { useSelector } from 'react-redux';

const usePermissions = () => {
  const isMasterAdmin = useSelector((state) => state.auth.isMasterAdmin);
  const permissions = useSelector((state) => state.auth.permissions);

  const hasPermission = (permission) => {
    let result = false;

    if (permissions?.includes(permission) || +isMasterAdmin === 1) {
      result = true;
    }
    console.log('hasPermission  result: ', result);
    
    return result;
  };
  return { hasPermission };
};
export default usePermissions;
