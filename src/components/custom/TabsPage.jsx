// Local Imports
import { Page } from 'components/shared/Page';
import { Outlet, NavLink, useLocation } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import clsx from 'clsx';
import { Button, Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
// import { useState } from 'react';
import usePermissions from 'app/router/usePermissions';

// ----------------------------------------------------------------------

export default function TabsPage({ tabs }) {
  const location = useLocation();
  const initialTabIndex = tabs.findIndex((tab) => location.pathname.includes(tab.path));
  const { hasPermission } = usePermissions();

  console.log('tab.permission: ', tabs);
  return (
    <Page>
      <TabGroup selectedIndex={initialTabIndex}>
        <div className="hide-scrollbar overflow-x-auto">
          <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
            <TabList className="-mb-0.5 flex">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  {(!tab.permission || hasPermission(tab.permission)) && !tab.isHidden && (
                    <NavLink to={tab.path}>
                      <Tab
                        key={tab.id}
                        className={({ selected }) =>
                          clsx(
                            'shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium rtl:space-x-reverse',
                            selected
                              ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                              : 'border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100'
                          )
                        }
                        as={Button}
                        unstyled="true">
                        <div className="flex gap-1.5">
                          <tab.icon className="size-4.5" />
                          <span>{tab.title}</span>
                        </div>
                      </Tab>
                    </NavLink>
                  )}
                </div>
              ))}
            </TabList>
          </div>
        </div>
        <TabPanels className="mt-2">
          <Outlet />
        </TabPanels>
      </TabGroup>
    </Page>
  );
}
