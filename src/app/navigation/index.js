import { dashboards } from './dashboards';

export const navigation = [dashboards()]; // do not use
export const getNavigation = () => [dashboards()];
export { baseNavigation } from './baseNavigation';
