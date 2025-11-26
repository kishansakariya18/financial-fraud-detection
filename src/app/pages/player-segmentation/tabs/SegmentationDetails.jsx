// Import Dependencies
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Skeleton } from 'components/ui';
import PlayerSegmentationService from 'services/player-segmentation.services';
import AuthService from 'services/auth.services';
import CurrencyService from 'services/currency.services';
import { createDefaultRuleTree } from 'components/sections/player-segmentation/ruleUtils';
import {
  attributeRegistry,
  operatorLabels,
  timeUnitLabels,
  NumericOperator,
  DatetimeOperator,
  SegmentAttributeKey
} from 'components/sections/player-segmentation/attributeRegistry';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const statusColorMap = {
  1: 'success',
  0: 'error'
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const DetailSection = ({ title, rows, children }) => (
  <section className="space-y-3">
    {title && (
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-dark-300">
        {title}
      </h3>
    )}
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-dark-700/40">
      {Array.isArray(rows) && rows.length > 0 && <KeyValueGrid rows={rows} />}
      {children}
    </div>
  </section>
);

const KeyValueGrid = ({ rows }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {rows.map(({ label, value }, index) => (
      <div key={`${label}-${index}`} className="space-y-1">
        <div className="text-xs font-semibold text-gray-500 dark:text-dark-300">{label}</div>
        <div className="text-sm text-gray-900 dark:text-dark-50">{renderValue(value)}</div>
      </div>
    ))}
  </div>
);

const renderValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-500 dark:text-dark-200">—</span>;
  }

  if (typeof value === 'object' && value.$$typeof) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return value;
};

// Component to display a single condition in a human-readable way
const ConditionDisplay = ({ condition, countryMap, currencyMap }) => {
  const attribute = attributeRegistry[condition.field];
  const attrLabel = attribute?.label || condition.field;
  const operatorLabel = operatorLabels[condition.operator] || condition.operator;

  const formatConditionValue = () => {
    if (!condition.value && condition.value !== 0 && condition.value !== false) {
      return '';
    }

    // Handle between operator (numeric range) - array format [min, max]
    if (condition.operator === NumericOperator.BETWEEN && Array.isArray(condition.value)) {
      if (condition.value.length === 2) {
        // Check if this is a datetime between operation
        if (condition.dataType === 'datetime' || condition.value[0]?.includes?.('-')) {
          return `${formatDateTime(condition.value[0])} to ${formatDateTime(condition.value[1])}`;
        }
        return `${condition.value[0]} and ${condition.value[1]}`;
      }
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

    // Handle datetime range operators
    if (
      condition.operator === DatetimeOperator.BETWEEN_RELATIVE &&
      typeof condition.value === 'object'
    ) {
      // Check for nested from/to structure
      if (condition.value.from && condition.value.to) {
        const fromUnit = timeUnitLabels[condition.value.from.unit] || condition.value.from.unit;
        const toUnit = timeUnitLabels[condition.value.to.unit] || condition.value.to.unit;
        return `${condition.value.from.amount} ${fromUnit} ago and ${condition.value.to.amount} ${toUnit} ago`;
      }
    }

    // Handle array values (IN, NOT_IN) - with proper mapping
    if (Array.isArray(condition.value)) {
      const mappedValues = condition.value.map((val) => {
        // Map country IDs to names
        if (condition.field === SegmentAttributeKey.COUNTRY && countryMap[val]) {
          return countryMap[val];
        }
        // Map currency IDs to codes
        if (condition.field === SegmentAttributeKey.CURRENCY && currencyMap[val]) {
          return currencyMap[val];
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
    if (condition.field === SegmentAttributeKey.COUNTRY && countryMap[condition.value]) {
      return countryMap[condition.value];
    }

    // Map single currency ID to code
    if (condition.field === SegmentAttributeKey.CURRENCY && currencyMap[condition.value]) {
      return currencyMap[condition.value];
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
const RuleTreeDisplay = ({ node, depth = 0, countryMap, currencyMap }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!node) return null;

  const indentClass = depth > 0 ? 'ml-6 border-l-2 border-gray-300 pl-4 dark:border-dark-500' : '';

  // Check if node is a condition (has field property)
  if (node.field !== undefined) {
    return (
      <div className={`py-1 ${indentClass}`}>
        <ConditionDisplay condition={node} countryMap={countryMap} currencyMap={currencyMap} />
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
              <svg
                className={`size-4 text-gray-600 transition-transform dark:text-dark-300 ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
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

const SegmentationDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { segmentationUID } = useParams();
  const [loading, setLoading] = useState(true);
  const [segmentationData, setSegmentationData] = useState(null);
  const [countryMap, setCountryMap] = useState({});
  const [currencyMap, setCurrencyMap] = useState({});

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: t('view') }
  ];

  // Fetch country and currency data for mapping
  useEffect(() => {
    const fetchMappingData = async () => {
      try {
        // Fetch countries
        const countryResponse = await AuthService.getCountries();
        if (countryResponse.response?.data) {
          const countryMapping = {};
          countryResponse.response.data.forEach((country) => {
            countryMapping[country.CountryID] = country.CountryName;
          });
          setCountryMap(countryMapping);
        }

        // Fetch currencies
        const currencyResponse = await CurrencyService.getPlatformCurrancyCodes();
        if (currencyResponse.response?.data) {
          const currencyMapping = {};
          currencyResponse.response.data.forEach((currency) => {
            currencyMapping[currency.CurrencyID] = currency.Code;
          });
          setCurrencyMap(currencyMapping);
        }
      } catch (error) {
        console.error('Error fetching mapping data:', error);
        // Continue without mappings - will just show IDs
      }
    };

    fetchMappingData();
  }, []);

  useEffect(() => {
    const fetchSegmentationDetail = async () => {
      if (!segmentationUID) {
        toast.error(t('invalid_segmentation_id') || 'Invalid segmentation ID');
        navigate('/bonus/player-segmentation');
        return;
      }

      try {
        setLoading(true);
        const response = await PlayerSegmentationService.detail(segmentationUID);

        if (response.status === 200 && response.response?.data) {
          const data = response.response.data;

          // Parse SegmentRules if it's a JSON string
          let parsedRules = createDefaultRuleTree();
          if (data.SegmentRules) {
            try {
              parsedRules =
                typeof data.SegmentRules === 'string'
                  ? JSON.parse(data.SegmentRules)
                  : data.SegmentRules;
            } catch (parseError) {
              console.error('Error parsing SegmentRules:', parseError);
            }
          }

          setSegmentationData({
            ...data,
            ParsedRules: parsedRules
          });
        } else {
          throw new Error(response.response?.message || 'Failed to fetch segmentation details');
        }
      } catch (error) {
        console.error('Error fetching segmentation details:', error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            t('failed_to_fetch_details') ||
            'Failed to fetch segmentation details'
        );
        navigate('/bonus/player-segmentation');
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentationDetail();
  }, [segmentationUID, navigate, t]);

  const statusBadge = segmentationData ? (
    <Badge variant="soft" color={statusColorMap[segmentationData.IsActive] || 'neutral'}>
      {segmentationData.IsActive === 1 ? 'Active' : 'Inactive'}
    </Badge>
  ) : null;

  if (loading) {
    return (
      <div className="space-y-4 px-6 py-6">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!segmentationData) {
    return (
      <Card className="px-6 py-6">
        <div className="text-sm text-gray-600 dark:text-dark-200">
          Unable to display player segmentation details.
        </div>
      </Card>
    );
  }

  return (
    <Page title={t('segmentation_details')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('player_segmentation')}
          </h2>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <DetailSection
          title={''}
          rows={[
            {
              label: t('segment_description'),
              value: segmentationData.SegmentDescription || '—'
            },
            { label: t('segment_tag'), value: segmentationData.SegmentTag || '—' },
            {
              label: t('status'),
              value: statusBadge
            },
            {
              label: t('scheduled') + ' ' + t('evaluation'),
              value: segmentationData.IsScheduled === 1 ? 'Enabled' : 'Disabled'
            },
            {
              label: t('evaluation_frequency'),
              value:
                segmentationData.IsScheduled === 1
                  ? segmentationData.EvaluationFrequency || '—'
                  : 'N/A'
            },
            {
              label: t('created_at'),
              value: formatDateTime(segmentationData.CreatedAt)
            },
            {
              label: t('updated_at'),
              value: formatDateTime(segmentationData.UpdatedAt)
            }
          ]}
        />

        <DetailSection title={t('segmentation') + ' ' + t('rules')}>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
            {segmentationData.ParsedRules ? (
              <RuleTreeDisplay
                node={segmentationData.ParsedRules}
                countryMap={countryMap}
                currencyMap={currencyMap}
              />
            ) : (
              <div className="text-sm italic text-gray-500 dark:text-dark-300">
                No rules defined
              </div>
            )}
          </div>
        </DetailSection>
      </div>
    </Page>
  );
};

export default SegmentationDetails;
