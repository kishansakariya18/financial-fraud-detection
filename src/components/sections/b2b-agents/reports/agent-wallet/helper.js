// Helper functions for Agent Wallet Report

/**
 * Maps API response to table data
 * @param {Array} apiData - Raw API response data
 * @returns {Array} Transformed data for table
 */
export const responseMapper = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((agent) => ({
    id: agent.AgentID,
    agentId: agent.AgentID,
    agentName: agent.AgentName || '-',
    agentType: agent.AgentType || '-',
    commissionBalance: parseFloat(agent.CommissionBalance || 0),
    lineUpBalance: parseFloat(agent.LineUpBalance || 0),
    dateModified: agent.DateModified
  }));
};

/**
 * Calculate grand total from balance and lineup balance
 */
export const calculateGrandTotal = (balance, lineUpBalance) => {
  return (parseFloat(balance || 0) + parseFloat(lineUpBalance || 0)).toFixed(2);
};
