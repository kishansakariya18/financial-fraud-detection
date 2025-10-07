import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';

/**
 * AgentRouteGuard - Central guard for all agent routes
 * Prevents non-agents from accessing agent routes without modifying individual route files
 */
export default function CallingAgentRouteGuard() {
  const userData = useSelector((state) => state.auth.userData);

  // If user is not an agent, redirect to home
  if (userData?.AdminType !== ADMIN_TYPE.AGENT) {
    return <Navigate to="/" replace />;
  }

  // For agent users, render the nested routes
  return <Outlet />;
}
