import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Badge } from 'components/ui';
import {
  attributeRegistry,
  operatorLabels,
  timeUnitLabels,
  NumericOperator,
  DatetimeOperator,
  SegmentAttributeKey
} from './attributeRegistry';
import { getDateInUTCToTimeZone } from 'helpers/functions';

// Component to display a single condition in a human-readable way
const ConditionDisplay = ({ condition, countryMap, affiliateMap, currencyMap }) => {
  const attribute = attributeRegistry[condition.field];
  const attrLabel = attribute?.label || condition.field;

  // Get context-aware operator label
  let operatorLabel = operatorLabels[condition.operator] || condition.operator;

  // Customize "Between" label based on data type
  if (condition.operator === 'between') {
    if (attribute?.dataType === 'numeric') {
      operatorLabel = 'Between';
    } else if (attribute?.dataType === 'datetime') {
      operatorLabel = 'Between (Relative)';
    }
  }

  const formatConditionValue = () => {
    if (!condition.value && condition.value !== 0 && condition.value !== false) {
      return '';
    }

    // Handle datetime relative values (less_than_x_ago, greater_than_x_ago)
    if (
      (condition.operator === DatetimeOperator.LESS_THAN_X_AGO ||
        condition.operator === DatetimeOperator.GREATER_THAN_X_AGO) &&
      typeof condition.value === 'object'
    ) {
      const unit = timeUnitLabels[condition.value.unit] || condition.value.unit;
      return `${condition.value.amount} ${unit} ago`;
    }

    // Handle datetime relative range (between) - check this BEFORE numeric between
    if (
      condition.operator === DatetimeOperator.BETWEEN &&
      Array.isArray(condition.value) &&
      condition.value.length === 2
    ) {
      // Check if it's array of time period objects (has unit property)
      if (condition.value[0]?.unit && condition.value[1]?.unit) {
        const fromUnit = timeUnitLabels[condition.value[0].unit] || condition.value[0].unit;
        const toUnit = timeUnitLabels[condition.value[1].unit] || condition.value[1].unit;
        return `${condition.value[0].amount} ${fromUnit} ago and ${condition.value[1].amount} ${toUnit} ago`;
      }
    }

    // Handle datetime absolute range (in_range)
    if (
      condition.operator === DatetimeOperator.IN_RANGE &&
      Array.isArray(condition.value) &&
      condition.value.length === 2
    ) {
      return `${getDateInUTCToTimeZone(condition.value[0])} to ${getDateInUTCToTimeZone(condition.value[1])}`;
    }

    // Handle between operator (numeric range) - array format [min, max]
    // This must come AFTER datetime checks since both use 'between' as operator value
    if (condition.operator === NumericOperator.BETWEEN && Array.isArray(condition.value)) {
      if (condition.value.length === 2) {
        // If we get here and it's datetime, it's a numeric between (shouldn't happen normally)
        if (condition.dataType === 'numeric') {
          return `${condition.value[0]} and ${condition.value[1]}`;
        }
      }
    }

    // Handle array values (IN, NOT_IN) - with proper mapping
    if (Array.isArray(condition.value)) {
      const mappedValues = condition.value.map((val) => {
        // Map country IDs to names
        if (condition.field === SegmentAttributeKey.COUNTRY && countryMap?.[val]) {
          return countryMap[val];
        }
        // Map currency IDs to codes
        if (condition.field === SegmentAttributeKey.CURRENCY && currencyMap?.[val]) {
          return currencyMap[val];
        }
        // Map affiliate IDs to names
        if (condition.field === SegmentAttributeKey.AFFILIATE && affiliateMap?.[val]) {
          return affiliateMap[val];
        }
        // Map account status
        if (condition.field === SegmentAttributeKey.ACCOUNT_STATUS) {
          const option = attribute?.options?.find((opt) => opt.value === val);
          return option ? option.label : val;
        }
        return val;
      });
      return mappedValues.join(', ');
    }

    // Handle single enum values with options
    if (attribute?.options) {
      const option = attribute.options.find((opt) => opt.value === condition.value);
      if (option) return option.label;
    }

    // Map single country ID to name
    if (condition.field === SegmentAttributeKey.COUNTRY && countryMap?.[condition.value]) {
      return countryMap[condition.value];
    }

    // Map single currency ID to code
    if (condition.field === SegmentAttributeKey.CURRENCY && currencyMap?.[condition.value]) {
      return currencyMap[condition.value];
    }
    // Map single affiliate ID to name
    if (condition.field === SegmentAttributeKey.AFFILIATE && affiliateMap?.[condition.value]) {
      return affiliateMap[condition.value];
    }

    return String(condition.value);
  };

  const valueStr = formatConditionValue();

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm dark:border-blue-800 dark:bg-blue-900/20">
      <span className="font-medium text-blue-900 dark:text-blue-200">{attrLabel}</span>
      <span className="text-blue-700 dark:text-blue-300">{operatorLabel}</span>
      {valueStr && (
        <span className="font-semibold text-blue-900 dark:text-blue-100">{valueStr}</span>
      )}
    </div>
  );
};

// Recursive component to display rule groups and conditions
export const RuleTreeDisplay = ({ node, depth = 0, countryMap, affiliateMap, currencyMap }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  if (!node) return null;

  const indentClass = depth > 0 ? 'ml-6 border-l-2 border-gray-300 pl-4 dark:border-dark-500' : '';

  // Check if node is a condition (has field property)
  if (node.field !== undefined) {
    return (
      <div className={`py-1 ${indentClass}`}>
        <ConditionDisplay
          condition={node}
          countryMap={countryMap}
          affiliateMap={affiliateMap}
          currencyMap={currencyMap}
        />
      </div>
    );
  }

  // Check if node is a group (has conditions array)
  if (node.conditions && Array.isArray(node.conditions)) {
    const operatorBadge = (
      <Badge
        variant="soft"
        color={node.operator === 'AND' ? 'primary' : 'secondary'}
        className="text-xs font-bold">
        {node.operator}
      </Badge>
    );

    const childrenCount = node.conditions.length;

    return (
      <div className={`space-y-2 ${indentClass}`}>
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Button */}
          {childrenCount > 0 && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex size-5 flex-shrink-0 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-dark-600"
              type="button"
              aria-label={isCollapsed ? 'Expand group' : 'Collapse group'}>
              <ChevronRightIcon
                className={`size-4 text-gray-600 transition-transform dark:text-dark-300 ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`}
              />
            </button>
          )}

          {operatorBadge}

          <span className="text-xs text-gray-600 dark:text-dark-300">
            {node.operator === 'AND'
              ? 'All of the following conditions must match:'
              : 'At least one of the following conditions must match:'}
          </span>

          {/* Show count when collapsed */}
          {isCollapsed && childrenCount > 0 && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-dark-600 dark:text-dark-300">
              {childrenCount} {childrenCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Children - only show when not collapsed */}
        {!isCollapsed && (
          <div className="space-y-2">
            {node.conditions.length > 0 ? (
              node.conditions.map((child, index) => (
                <div key={child.id || index}>
                  <RuleTreeDisplay
                    node={child}
                    depth={depth + 1}
                    countryMap={countryMap}
                    affiliateMap={affiliateMap}
                    currencyMap={currencyMap}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm italic text-gray-500 dark:text-dark-300">No conditions</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};
