// Helper functions for Agent Commission Report

export const commissionTypeOptions = [
  {
    value: 'turnover',
    label: 'Turnover',
    color: 'primary'
  },
  {
    value: 'cpa',
    label: 'CPA',
    color: 'warning'
  }
];

/**
 * Maps API response to table data
 * @param {Array} apiData - Raw API response data
 * @returns {Array} Transformed data for table
 */
export const responseMapper = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((commissionLog) => {
    const agent = commissionLog.agent || {};

    return {
      id: commissionLog.AgentCommissionLogID,
      agentCommissionLogId: commissionLog.AgentCommissionLogID,
      agentId: commissionLog.AgentID,
      agentUID: agent.AgentUID,
      agentName: agent.Username || '-',
      agentType: agent.AgentType,
      userId: commissionLog.UserID,
      commissionType: commissionLog.CommissionType || '-',
      settingId: commissionLog.SettingID,
      commissionEarned: parseFloat(commissionLog.CommissionEarned || 0),
      transactionId: commissionLog.TransactionID,
      remarks: commissionLog.Remarks,
      dateCreated: commissionLog.DateCreated
    };
  });
};

/**
 * Format commission type for display
 */
export const formatCommissionType = (type) => {
  if (!type || type === '-') return '-';
  return type.charAt(0).toUpperCase() + type.slice(1);
};
