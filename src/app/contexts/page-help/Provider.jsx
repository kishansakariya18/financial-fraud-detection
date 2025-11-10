import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';

import { PageHelpDrawer } from 'components/template/RightSidebar/PageHelpDrawer';
import { PageHelpContextProvider } from './context';

// ----------------------------------------------------------------------

export function PageHelpProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    pageKey: null,
    context: {}
  });

  const openHelp = useCallback((pageKey, payload = {}) => {
    if (!pageKey) {
      return;
    }

    setState({
      isOpen: true,
      pageKey,
      context: payload
    });
  }, []);

  const closeHelp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const setPageKey = useCallback((pageKey) => {
    setState((prev) => ({
      ...prev,
      pageKey
    }));
  }, []);

  const value = useMemo(
    () => ({
      pageKey: state.pageKey,
      isOpen: state.isOpen,
      context: state.context,
      openHelp,
      closeHelp,
      setPageKey
    }),
    [state, openHelp, closeHelp, setPageKey]
  );

  return (
    <PageHelpContextProvider value={value}>
      {children}
      <PageHelpDrawer />
    </PageHelpContextProvider>
  );
}

PageHelpProvider.propTypes = {
  children: PropTypes.node
};
