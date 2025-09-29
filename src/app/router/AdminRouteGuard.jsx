import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';

/**
 * AdminRouteGuard - Central guard for all admin routes
 * Prevents agents from accessing admin routes without modifying individual route files
 */
export default function AdminRouteGuard() {
  const userData = useSelector((state) => state.auth.userData);
  // If user is an calling agent, redirect to calling agent dashboard
  if (userData?.AdminType === ADMIN_TYPE.AGENT) {
    return <Navigate to="/calling-agents/dashboard" replace />;
  }

  // If user is an agent, redirect to agent dashboard
  if (userData?.AgentUID) {
    return <Navigate to="/agent/dashboard" replace />;
  }

  // For admin users, render the nested routes
  return <Outlet />;
}
