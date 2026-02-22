import { useThemeContext } from 'app/contexts/theme/context';

import { Page } from 'components/shared/Page';

export default function AuthLayout({ children, title = 'Login' }) {
  const { isDark } = useThemeContext();

  console.log('isDark: ', isDark);

  return (
    <Page title={title}>
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            {/* {logoComponent || (isDark ? <DarkThemeLogo /> : <LightThemeLogo />)} */}
          </div>
          {children}
        </div>
      </main>
    </Page>
  );
}
