// Import Dependencies
import { useLocation } from 'react-router';
import { useRef, useState } from 'react';
import { useDidUpdate, useIsomorphicEffect } from 'hooks';
import SimpleBar from 'simplebar-react';

// Local Imports
import { getNavigation } from 'app/navigation';
import { Group } from './Group';
import { Accordion } from 'components/ui';
import { isRouteActive } from 'utils/isRouteActive';

// ----------------------------------------------------------------------
export function Menu() {
  const navigation = getNavigation();
  const { pathname } = useLocation();
  const { ref } = useRef();

  const activeGroup = navigation.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });
  console.log('activeGroup::', activeGroup);

  const activeCollapsible = activeGroup?.childs?.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });
  console.log('activeCollapsible::', activeCollapsible);

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
          console.log('navigation:', nav);
          return <Group key={nav.id} data={nav} />;
        })}
      </Accordion>
    </SimpleBar>
  );
}
