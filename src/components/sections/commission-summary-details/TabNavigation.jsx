import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import { HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

export function TabNavigation({ summaryData, agentUID, breadcrumbs, children }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'summary';

  const tabs = [
    {
      id: 'summary',
      title: t('summary'),
      icon: HomeIcon
    },
    {
      id: 'events',
      title: t('commission_events'),
      icon: ListBulletIcon
    }
  ];

  const visibleTabs = tabs.filter((tab) => !tab.hidden);
  const selectedIndex = visibleTabs.findIndex((tab) => tab.id === currentTab);
  const validSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const handleTabChange = (index) => {
    const selectedTab = visibleTabs[index];
    setSearchParams({ tab: selectedTab.id });
  };

  return (
    <TabGroup selectedIndex={validSelectedIndex} onChange={handleTabChange}>
      <div className="hide-scrollbar overflow-x-auto">
        <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
          <TabList className="-mb-0.5 flex">
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  clsx(
                    'shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium rtl:space-x-reverse',
                    selected
                      ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                      : 'border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100'
                  )
                }>
                <div className="flex gap-1.5">
                  <tab.icon className="size-4.5" />
                  <span>{tab.title}</span>
                </div>
              </Tab>
            ))}
          </TabList>
        </div>
      </div>

      <TabPanels className="mt-2">
        {children && typeof children === 'function'
          ? children({ currentTab, summaryData, agentUID, breadcrumbs })
          : children}
      </TabPanels>
    </TabGroup>
  );
}

TabNavigation.propTypes = {
  summaryData: PropTypes.object,
  agentUID: PropTypes.string,
  breadcrumbs: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};
