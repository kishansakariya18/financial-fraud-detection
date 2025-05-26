// Local Imports
import { Progress } from 'components/ui';
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
import { useThemeContext } from 'app/contexts/theme/context';

// ----------------------------------------------------------------------

export function SplashScreen() {
  const { isDark } = useThemeContext();

  return (
    <div className="fixed grid h-full w-full place-content-center">
      {isDark ? <DarkThemeLogo /> : <LightThemeLogo />}
      <Progress color="primary" isIndeterminate animationDuration="1s" className="mt-2 h-1" />
    </div>
  );
}
