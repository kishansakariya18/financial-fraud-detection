import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

/**
 * AgentRouteGuard - Central guard for all agent routes
 * Prevents non-agents from accessing agent routes without modifying individual route files
 */
export default function B2BAgentRouteGuard() {
  const userData = useSelector((state) => state.auth.userData);

  // If user is not an agent, redirect to home
  if (!userData?.AgentUID) {
    return <Navigate to="/" replace />;
  }

  // For agent users, render the nested routes
  return <Outlet />;
}
