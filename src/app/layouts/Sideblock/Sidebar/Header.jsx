// Import Dependencies
// import { Link } from 'react-router';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

// Local Imports
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
// import LogoType from 'assets/logotype.svg?react';
import { Button } from 'components/ui';
import { useSidebarContext } from 'app/contexts/sidebar/context';
import { useThemeContext } from 'app/contexts/theme/context';

// ----------------------------------------------------------------------

export function Header() {
  const { close } = useSidebarContext();
  const { isDark } = useThemeContext();

  console.log('theme: ', isDark);

  return (
    <header className="relative flex h-[61px] shrink-0 items-center justify-between ltr:pr-4 rtl:pl-2 rtl:pr-3">
      {/* <div className="flex items-center justify-start gap-4 pt-3"> */}
      {/* <Link to="/"></Link> */}
      {/* <LogoType className="h-5 w-auto text-gray-800 dark:text-dark-50" /> */}

      {isDark ? <DarkThemeLogo /> : <LightThemeLogo />}
      <div className="pt-5 xl:hidden">
        <Button onClick={close} variant="flat" isIcon className="size-6 rounded-full">
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </header>
  );
}
