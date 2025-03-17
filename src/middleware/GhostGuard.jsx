// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
// import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

// ----------------------------------------------------------------------


export default function GhostGuard() {

  console.log('ghost route called')
  const outlet = useOutlet();
  // const { isAuthenticated } = useAuthContext();
  const isAuthenticated  = true

  const url = `${new URLSearchParams(window.location.search).get(
    REDIRECT_URL_KEY,
  )}`;

  if (isAuthenticated) {
    if (url && url !== "") {
      return <Navigate to={url} />;
    }
    return <Navigate to={HOME_PATH} />;
  }

  return <>{outlet}</>;
}
