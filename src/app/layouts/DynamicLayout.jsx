/*// Import Dependencies
import { lazy, useMemo } from 'react';

// Local Imports
import { useThemeContext } from 'app/contexts/theme/context';
import { Loadable } from 'components/shared/Loadable';
import { SplashScreen } from 'components/template/SplashScreen';
import { Outlet } from 'react-router';
import BottomNav from 'components/shared/BottomNav';
// ----------------------------------------------------------------------

const themeLayouts = {
  'main-layout': lazy(() => import('./MainLayout')),
  sideblock: lazy(() => import('./Sideblock'))
};

export function DynamicLayout() {
  const { themeLayout } = useThemeContext();

  const CurrentLayout = useMemo(
    () => Loadable(themeLayouts[themeLayout], SplashScreen),
    [themeLayout]
  );

  return <CurrentLayout />;
}
*/
/*
import { lazy, useMemo } from 'react';
import { useThemeContext } from 'app/contexts/theme/context';
import { Loadable } from 'components/shared/Loadable';
import { SplashScreen } from 'components/template/SplashScreen';
import BottomNav from 'components/shared/BottomNav';

// ✅ ONLY ONE LAYOUT (no sideblock)
const themeLayouts = {
  'main-layout': lazy(() => import('./MainLayout'))
};

function DynamicLayout() {
  const { themeLayout } = useThemeContext();

  const CurrentLayout = useMemo(
    () => Loadable(themeLayouts[themeLayout] || themeLayouts['main-layout'], SplashScreen),
    [themeLayout]
  );

  return (
    <>
      <CurrentLayout />
      <BottomNav />
    </>
  );
}

export { DynamicLayout };
*/

import { lazy, useMemo } from 'react';
import { useThemeContext } from 'app/contexts/theme/context';
import { Loadable } from 'components/shared/Loadable';
import { SplashScreen } from 'components/template/SplashScreen';

const themeLayouts = {
  'main-layout': lazy(() => import('./MainLayout'))
};

export function DynamicLayout() {
  const { themeLayout } = useThemeContext();

  const CurrentLayout = useMemo(
    () => Loadable(themeLayouts[themeLayout] || themeLayouts['main-layout'], SplashScreen),
    [themeLayout]
  );

  return (
    <>
      {/* Layout */}
      <CurrentLayout />
    </>
  );
}
