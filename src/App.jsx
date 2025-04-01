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

// ----------------------------------------------------------------------

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
