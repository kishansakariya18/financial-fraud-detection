import { Navigate } from 'react-router';
import usePermissions from './usePermissions';

const PrivateRoute = ({ permission, children }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default PrivateRoute;
