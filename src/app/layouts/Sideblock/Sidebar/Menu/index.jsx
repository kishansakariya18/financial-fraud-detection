// Import Dependencies
import { useLocation } from 'react-router';
import { useRef, useState } from 'react';
import { useDidUpdate, useIsomorphicEffect } from 'hooks';
import SimpleBar from 'simplebar-react';

// Local Imports
import { navigation } from 'app/navigation';
import { Group } from './Group';
import { Accordion } from 'components/ui';
import { isRouteActive } from 'utils/isRouteActive';
import usePermissions from 'app/router/usePermissions';

// ----------------------------------------------------------------------

export function Menu() {
  const { pathname } = useLocation();
  const { ref } = useRef();
  const { hasPermission } = usePermissions();

  const activeGroup = navigation.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });

  const activeCollapsible = activeGroup?.childs?.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });

  const [expanded, setExpanded] = useState(activeCollapsible?.path || null);

  useDidUpdate(() => {
    activeCollapsible?.path !== expanded && setExpanded(activeCollapsible?.path);
  }, [activeCollapsible?.path]);

  useIsomorphicEffect(() => {
    const activeItem = ref?.current.querySelector('[data-menu-active=true]');
    activeItem?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <SimpleBar scrollableNodeProps={{ ref }} className="h-full overflow-x-hidden pb-6">
      <Accordion value={expanded} onChange={setExpanded} className="space-y-1">
        {navigation.map((nav) => {
          if (!nav.permission || nav.permission?.some((p) => hasPermission(p))) {
            return <Group key={nav.id} data={nav} />;
          }
          return null;
        })}
      </Accordion>
    </SimpleBar>
  );
}
