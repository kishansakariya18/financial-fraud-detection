import { NavLink, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  HomeIcon,
  EnvelopeIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { TabGroup, TabList } from "@headlessui/react";

const TabNavigation = () => {
  //   const location = useLocation();
  const { adminId } = useParams();
  const tabs = [
    { title: "Details", path: `/admin/${adminId}/tab/details`, icon: HomeIcon },
    { title: "Profile", path: "/profile", icon: UserIcon },
    { title: "Messages", path: "/messages", icon: EnvelopeIcon },
    { title: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <TabGroup defaultIndex={0} >
      <div className="hide-scrollbar overflow-x-auto border-b-2 border-gray-150 dark:border-dark-500">
        <div className="flex w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
          <TabList className="flex w-max min-w-full px-1.5 py-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  clsx(
                    "shrink-0 space-x-2 px-3 py-2 font-medium rtl:space-x-reverse",
                    isActive
                      ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                      : "border-transparent hover:text-gray-800 dark:hover:text-dark-100",
                  )
                }
              >
                <tab.icon className="size-4.5" />
                <span>{tab.title}</span>
              </NavLink>
            ))}
          </TabList>
        </div>
      </div>
    </TabGroup>
  );
};

export default TabNavigation;
