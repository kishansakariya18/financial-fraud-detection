/* eslint-disable react-hooks/rules-of-hooks */
import { dashboards } from './dashboards';
import { agentNavigation } from './calling-agent';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';

export const navigation = [dashboards()]; // do not use

export const getNavigation = () => {
  const userData = useSelector((state) => state.auth.userData);
  if (userData?.AdminType === ADMIN_TYPE.AGENT) {
    // Agent users see only agent navigation
    return [agentNavigation];
  } else {
    // Admin users see admin dashboards navigation
    return [dashboards()];
  }
};

export { baseNavigation } from './baseNavigation';
