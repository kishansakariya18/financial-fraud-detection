import { dashboards } from './dashboards';
import { filterNavigationByPlatform } from 'utils/platformNavigation';

export const navigation = [dashboards()]; // do not use

export const getNavigation = () => {
  // Admin users see admin dashboards navigation
  const adminNav = dashboards();

  // Filter admin navigation based on platform
  const filteredAdminNav = filterNavigationByPlatform([adminNav]);
  return filteredAdminNav;
};

export { baseNavigation } from './baseNavigation';
