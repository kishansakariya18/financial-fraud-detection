// Import Dependencies
import { Navigate, Outlet, useLocation } from "react-router";

import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log('isLoggedIn: ', isLoggedIn);
  
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );

}
