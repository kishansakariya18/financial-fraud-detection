// Import Dependencies
import { RouterProvider } from 'react-router';

// Local Imports
import { BreakpointProvider } from 'app/contexts/breakpoint/Provider';
import { LocaleProvider } from 'app/contexts/locale/Provider';
import { SidebarProvider } from 'app/contexts/sidebar/Provider';
import { ThemeProvider } from 'app/contexts/theme/Provider';
import { TimezoneProvider } from 'app/contexts/timezone/Provider';
import router from 'app/router/router';
import { Provider } from 'react-redux';
import store from './store/index';
import { useEffect } from 'react';
import { CurrencyProvider } from 'app/contexts/currency/Provider';

// ----------------------------------------------------------------------

function App() {
  useEffect(() => {
    const disableScroll = () => {
      if (document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };

    window.addEventListener('wheel', disableScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', disableScroll);
    };
  }, []);
  return (
    <Provider store={store}>
      <CurrencyProvider>
        <ThemeProvider>
          <LocaleProvider>
            <BreakpointProvider>
              <SidebarProvider>
                <TimezoneProvider>
                  <RouterProvider router={router} />
                </TimezoneProvider>
              </SidebarProvider>
            </BreakpointProvider>
          </LocaleProvider>
        </ThemeProvider>
      </CurrencyProvider>
    </Provider>
  );
}

export default App;
