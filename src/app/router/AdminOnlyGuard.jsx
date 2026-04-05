import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

/**
 * Restricts route tree to users with role ADMIN (fraud admin panel).
 */
export default function AdminOnlyGuard() {
  const userData = useSelector((state) => state.auth.userData);
  const role = String(userData?.role || '').toUpperCase();

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboards/home" replace />;
  }

  return <Outlet />;
}
