import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';
import usePermissions from './usePermissions';
import apiConfig from 'configs/api.config';

const PrivateRoute = ({ permission, children, allowedPlatforms = null, fallbackPath = null }) => {
  const { hasPermission } = usePermissions();
  const userData = useSelector((state) => state.auth.userData);
  if (!fallbackPath) {
    fallbackPath = userData?.AdminType === ADMIN_TYPE.AGENT ? '/calling-agents/dashboard' : '/';
  }

  if (!hasPermission(permission)) {
    // Redirect based on user type when permission is denied
    if (userData?.AdminType === ADMIN_TYPE.AGENT) {
      return <Navigate to={fallbackPath} replace />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  if (allowedPlatforms && !allowedPlatforms.includes(apiConfig.platformType)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};
export default PrivateRoute;
