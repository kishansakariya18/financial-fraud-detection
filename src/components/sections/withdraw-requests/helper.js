/**
 * Helper functions for withdraw request data transformation
 */

/**
 * Transforms API data to match table column structure
 * @param {Array} apiData - Raw API data array
 * @returns {Array} - Transformed data for table display
 */
export const transformWithdrawRequestData = (apiData) => {
  if (!Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((item) => ({
    // Map API fields to table column fields
    requestId: item.AgentPlayerWithdrawRequestID,
    agentName: item.FromAgent?.Username || '-',
    playerName: item.FromPlayer?.Username || '-',
    amount: item.RequestedAmount || 0,
    entityType: item.ToEntityType || 'b2b_agent',
    status: item.Status || 'pending',
    remarks: item.Remarks || '-',
    createdAt: item.RequestedAt,
    approvedBy: item.ApprovedBy,
    settledAt: item.SettledAt,
    rejectedAt: item.RejectedAt,
    fromEntityType: item.FromEntityType,
    fromEntityID: item.FromEntityID,
    toEntityType: item.ToEntityType,
    toEntityID: item.ToEntityID,
    // Keep original data for actions
    original: item
  }));
};

/**
 * Gets entity type display label
 * @param {string} entityType - Entity type from API
 * @returns {string} - Display label
 */
export const getEntityTypeLabel = (entityType) => {
  switch (entityType) {
    case 'b2b_agent':
      return 'Agent';
    case 'admin':
      return 'Admin';
    case 'player':
      return 'Player';
    default:
      return entityType || 'Unknown';
  }
};

/**
 * Gets status color classes for styling
 * @param {string} status - Status value
 * @returns {string} - CSS classes for status styling
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'settled':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export const entityTypeOptions = [
  { label: 'Agent', value: 'b2b_agent', color: 'success' },
  { label: 'Admin', value: 'admin', color: 'success' },
  { label: 'Player', value: 'player', color: 'success' }
];

export const statusOptions = [
  { label: 'Pending', value: 'pending', color: 'warning' },
  { label: 'Settled', value: 'settled', color: 'success' },
  { label: 'Rejected', value: 'rejected', color: 'error' }
];

/**
 * Formats date for display
 * @param {string} dateString - Date string from API
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
};
