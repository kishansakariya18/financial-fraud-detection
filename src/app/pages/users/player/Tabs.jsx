// Local Imports
import { Page } from 'components/shared/Page';
import { Outlet, NavLink, useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import clsx from 'clsx';
import { AdjustmentsVerticalIcon, HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Button, Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import { randomId } from 'utils/randomId';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { playerId } = useParams();
  const { t } = useTranslation();
  // const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/player/${playerId}/tab/details`,
      icon: HomeIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('limits'),
      path: `/player/${playerId}/tab/limits`,
      icon: AdjustmentsVerticalIcon,
      index: 1
    },
    {
      id: randomId(),
      title: t('transactions'),
      path: `/player/${playerId}/tab/transactions`,
      icon: ListBulletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/player/${playerId}/tab/login-history`,
      icon: ListBulletIcon,
      index: 3
    }
  ];

  const initialTabIndex = tabs.findIndex((tab) => location.pathname.includes(tab.path));
  const [selectedIndex, setSelectedIndex] = useState(initialTabIndex !== -1 ? initialTabIndex : 0);

  return (
    <Page title="Players Tabs">
      <TabGroup selectedIndex={selectedIndex}>
        <div className="hide-scrollbar overflow-x-auto border-b-2 border-gray-150 dark:border-dark-500">
          <div className="flex w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
            <TabList className="flex w-max min-w-full px-1.5 py-1">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  <NavLink to={tab.path} onClick={() => setSelectedIndex(tab.index)}>
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
                </div>
              ))}
            </TabList>
          </div>
        </div>
        <TabPanels className="mt-2">
          <Outlet />
        </TabPanels>
      </TabGroup>
      {/* <TabNavigation /> */}
    </Page>
  );
}
