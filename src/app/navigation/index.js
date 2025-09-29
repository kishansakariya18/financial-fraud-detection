/* eslint-disable react-hooks/rules-of-hooks */
import { dashboards } from './dashboards';
import { agentNavigation } from './calling-agent';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE, AGENT_TIER_TYPE } from 'constants/app.constant';
import { b2bAgentNavigationLayout } from './b2b-agent-navigation-layout';

export const navigation = [dashboards()]; // do not use

export const getNavigation = () => {
  const userData = useSelector((state) => state.auth.userData);
  if (userData?.AgentUID) {
    const isTyre3Agent = userData?.AgentType === AGENT_TIER_TYPE.TIER_3;
    if (isTyre3Agent) {
      b2bAgentNavigationLayout.childs = b2bAgentNavigationLayout.childs.filter(
        (child) => child.id !== 'b2b_agents'
      );
    }
    return [b2bAgentNavigationLayout];
  }
  if (userData?.AdminType === ADMIN_TYPE.AGENT) {
    // Agent users see only agent navigation
    return [agentNavigation];
  } else {
    // Admin users see admin dashboards navigation
    return [dashboards()];
  }
};

export { baseNavigation } from './baseNavigation';
