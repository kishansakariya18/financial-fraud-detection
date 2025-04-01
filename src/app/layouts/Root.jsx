// Import Dependencies
import { Outlet, ScrollRestoration } from 'react-router';
import { lazy } from 'react';

// Local Imports
// import { useAuthContext } from "app/contexts/auth/context";
// import { SplashScreen } from "components/template/SplashScreen";
import { Progress } from 'components/template/Progress';
import { Loadable } from 'components/shared/Loadable';
// import { useSelector } from "react-redux";

const Toaster = Loadable(lazy(() => import('components/template/Toaster')));
const Customizer = Loadable(lazy(() => import('components/template/Customizer')));
const Tooltip = Loadable(lazy(() => import('components/template/Tooltip')));

// ----------------------------------------------------------------------

function Root() {
  // const { isInitialized } = useAuthContext();

  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  // console.log('is logged in: ', isLoggedIn)

  // if (!isLoggedIn) {
  //   return <SplashScreen />;
  // }

  return (
    <>
      <Progress />
      <ScrollRestoration />
      <Outlet />
      <Tooltip />
      <Toaster />
      <Customizer />
    </>
  );
}

export default Root;
