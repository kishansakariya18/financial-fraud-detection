import { getDateInUTCToTimeZone } from 'helpers/functions';

/**
 * Maps API response (PascalCase) to application format (camelCase) for player segmentations
 * Based on PlayerSegmentation model
 */
export const playerSegmentationResponseMapper = (apiData: any) => {
    const list = apiData.map((item: any) => {
        return {
            id: item.SegmentationID,
            segmentationID: item.SegmentationID,
            segmentationUID: item.SegmentationUID,
            segmentName: item.SegmentName,
            segmentDescription: item.SegmentDescription || '',
            segmentTag: item.SegmentTag || '',
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
export const statusToApp = (status: number) => {
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
export const statusToAPI = (status: string) => {
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
    }
];

/**
 * Evaluation frequency options
 */
export const evaluationFrequencyOptions = [
    {
        value: 'HOURLY',
        label: 'Hourly',
        color: 'primary'
    },
    {
        value: 'DAILY',
        label: 'Daily',
        color: 'success'
    },
    {
        value: 'WEEKLY',
        label: 'Weekly',
        color: 'warning'
    },
    {
        value: 'MONTHLY',
        label: 'Monthly',
        color: 'error'
    }
];

/**
 * Get filter summary text from SegmentRules object
 */
export const getRulesSummary = (rules: any): string => {
    if (!rules || typeof rules !== 'object') return '-';

    try {
        // Check if it's a hierarchical rule structure
        if (rules.type === 'group' && Array.isArray(rules.rules)) {
            const ruleCount = countRules(rules);
            return `${ruleCount} condition${ruleCount !== 1 ? 's' : ''}`;
        }

        return 'Custom rules';
    } catch (e) {
        return '-';
    }
};

/**
 * Recursively count rules in a hierarchical structure
 */
const countRules = (node: any): number => {
    if (node.type === 'condition') {
        return 1;
    }

    if (node.type === 'group' && Array.isArray(node.rules)) {
        return node.rules.reduce((count: number, rule: any) => count + countRules(rule), 0);
    }

    return 0;
};
