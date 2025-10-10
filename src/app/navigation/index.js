/* eslint-disable react-hooks/rules-of-hooks */
import { dashboards } from './dashboards';
import { agentNavigation } from './calling-agent';
import { useSelector } from 'react-redux';
import { ADMIN_TYPE, AGENT_TIER_TYPE } from 'constants/app.constant';
import { b2bAgentNavigationLayout } from './b2b-agent-navigation-layout';
import { filterNavigationByPlatform, isB2BPlatform } from 'utils/platformNavigation';

export const navigation = [dashboards()]; // do not use

export const getNavigation = () => {
  const userData = useSelector((state) => state.auth.userData);

  if (userData?.AgentUID) {
    // B2B Agent navigation - only show if platform is B2B
    if (!isB2BPlatform()) {
      return [];
    }

    const isTyre3Agent = userData?.AgentType === AGENT_TIER_TYPE.TIER_3;
    if (isTyre3Agent) {
      b2bAgentNavigationLayout.childs = b2bAgentNavigationLayout.childs.filter(
        (child) => !['b2b_agents', 'b2b_agent_tree'].includes(child.id)
      );
    }
    // Filter B2B agent navigation based on platform
    const filteredB2BAgentNav = filterNavigationByPlatform([b2bAgentNavigationLayout]);
    return filteredB2BAgentNav;
  }

  if (userData?.AdminType === ADMIN_TYPE.AGENT) {
    // Filter calling agent navigation based on platform
    const filteredAgentNav = filterNavigationByPlatform([agentNavigation]);
    return filteredAgentNav;
  } else {
    // Admin users see admin dashboards navigation
    const adminNav = dashboards();

    // Filter admin navigation based on platform
    const filteredAdminNav = filterNavigationByPlatform([adminNav]);
    return filteredAdminNav;
  }
};

export { baseNavigation } from './baseNavigation';
