// Local Imports
import { Page } from "components/shared/Page";
import { Outlet, NavLink, useParams } from "react-router";
// import TabNavigation from "./ShiftLeftAnimation";
import clsx from "clsx";
import { HomeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

export default function Tabs() {
  const { playerId } = useParams();
  const tabs = [
    {
      id: randomId(),
      title: "Limits",
      path: `/player/${playerId}/tab/limits`,
      icon: HomeIcon,
    },
    // { id: randomId(), title: "Profile", path: `/admin/${adminId}/tab/edit`, icon: TbEditCircle },
    // { id: randomId(), title: "Messages", path: "/messages", icon: EnvelopeIcon },
    // { id: randomId(), title: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <Page title="Players Tabs">
      <TabGroup defaultIndex={0}>
        <div className="hide-scrollbar overflow-x-auto border-b-2 border-gray-150 dark:border-dark-500">
          <div className="flex w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
            <TabList className="flex w-max min-w-full px-1.5 py-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    clsx(
                      "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium rtl:space-x-reverse",
                      selected
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                        : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
                    )
                  }
                  as={Button}
                  unstyled="true"
                >
                  <NavLink>
                    <tab.icon className="size-4.5" />
                    <span>{tab.title}</span>
                  </NavLink>
                </Tab>
              ))}
            </TabList>
          </div>
        </div>
        <TabPanels className="mt-2">
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>
              <Outlet />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
      {/* <TabNavigation /> */}
    </Page>
  );
}
