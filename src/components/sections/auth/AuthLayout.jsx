import { useThemeContext } from 'app/contexts/theme/context';

import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
import { Page } from 'components/shared/Page';

export default function AuthLayout({ children, title = 'Login', logoComponent = null }) {
  const { isDark } = useThemeContext();

  return (
    <Page title={title}>
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            {logoComponent || (isDark ? <DarkThemeLogo /> : <LightThemeLogo />)}
          </div>
          {children}
        </div>
      </main>
    </Page>
  );
}
