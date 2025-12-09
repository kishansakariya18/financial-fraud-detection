import { getDateInUTCToTimeZone } from 'helpers/functions';

/**
 * Maps API response (PascalCase) to application format (camelCase) for player segmentations
 * Based on PlayerSegmentation model
 */
export const playerSegmentationResponseMapper = (apiData) => {
  const list = apiData.map((item) => {
    return {
      id: item.SegmentationID,
      segmentationID: item.SegmentationID,
      segmentationUID: item.SegmentationUID,
      segmentName: item.SegmentName,
      segmentDescription: item.SegmentDescription || '',
      segmentTag: item.SegmentTag || '-',
      segmentRules: item.SegmentRules || {},
      isActive: statusToApp(item.IsActive),
      status: statusToApp(item.IsActive),
      isScheduled: item.IsScheduled === 1,
      evaluationFrequency: item.EvaluationFrequency || '',
      lastEvaluatedAt: item.LastEvaluatedAt ? getDateInUTCToTimeZone(item.LastEvaluatedAt) : '',
      nextEvaluationAt: item.NextEvaluationAt ? getDateInUTCToTimeZone(item.NextEvaluationAt) : '',
      createdBy: item.CreatedBy,
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '',
      updatedAt: item.DateUpdated ? getDateInUTCToTimeZone(item.DateUpdated) : '',
      _originalData: item
    };
  });

  return list;
};

/**
 * Convert status from API (1/0) to app (active/inactive)
 */
export const statusToApp = (status) => {
  switch (status) {
    case 1:
      return 'active';
    case 0:
      return 'inactive';
    case 2:
      return 'archived';
    default:
      return 'active';
  }
};

export const statusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    case 'archived':
      return 2;
    default:
      return 1;
  }
};

/**
 * Status options for filters
 */
export const statusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success'
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error'
  },
  {
    value: 'archived',
    label: 'Archived',
    color: 'warning'
  }
];

/**
 * Evaluation frequency options
 */
export const evaluationFrequencyOptions = [
  {
    value: 'HOURLY',
    label: 'Hourly'
  },
  {
    value: 'DAILY',
    label: 'Daily'
  },
  {
    value: 'WEEKLY',
    label: 'Weekly'
  },
  {
    value: 'MONTHLY',
    label: 'Monthly'
  },
  {
    value: 'NONE',
    label: 'None'
  }
];

/**
 * Get filter summary text from SegmentRules object
 */
export const getRulesSummary = (rules) => {
  if (!rules || typeof rules !== 'object') return '-';

  try {
    // Check if it's a hierarchical rule structure
    if (rules.type === 'group' && Array.isArray(rules.rules)) {
      const ruleCount = countRules(rules);
      return `${ruleCount} condition${ruleCount !== 1 ? 's' : ''}`;
    }

    return 'Custom rules';
  } catch (e) {
    console.error('Error getting rules summary:', e);
    return '-';
  }
};

/**
 * Recursively count rules in a hierarchical structure
 */
const countRules = (node) => {
  if (node.type === 'condition') {
    return 1;
  }

  if (node.type === 'group' && Array.isArray(node.rules)) {
    return node.rules.reduce((count, rule) => count + countRules(rule), 0);
  }

  return 0;
};
