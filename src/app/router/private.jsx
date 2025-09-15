import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';
import usePermissions from './usePermissions';

const PrivateRoute = ({ permission, children }) => {
  const { hasPermission } = usePermissions();
  const userData = useSelector((state) => state.auth.userData);

  if (!hasPermission(permission)) {
    // Redirect based on user type when permission is denied
    if (userData?.AdminType === ADMIN_TYPE.AGENT) {
      return <Navigate to="/calling-agents/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
export default PrivateRoute;
