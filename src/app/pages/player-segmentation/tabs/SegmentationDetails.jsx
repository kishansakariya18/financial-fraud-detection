// Import Dependencies
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Badge, Card, Skeleton } from 'components/ui';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { createDefaultRuleTree } from 'components/sections/player-segmentation/ruleUtils';
import { RuleTreeDisplay } from 'components/sections/player-segmentation/RuleTreeDisplay';
import { useSegmentationMappings } from 'components/sections/player-segmentation/useSegmentationMappings';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const statusColorMap = {
  1: 'success',
  0: 'error'
};
const DetailSection = ({ title, rows, children, className }) => (
  <section className={`space-y-3 ${className}`}>
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

const SegmentationDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { segmentationUID } = useParams();
  const [loading, setLoading] = useState(true);
  const [segmentationData, setSegmentationData] = useState(null);

  // Use the custom hook to fetch and cache mapping data
  const { countryMap, currencyMap, affiliateMap } = useSegmentationMappings({
    fetchCountries: true,
    fetchCurrencies: true,
    fetchAffiliates: true
  });

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: t('view') }
  ];

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
              value: getDateInUTCToTimeZone(segmentationData.CreatedAt)
            },
            {
              label: t('updated_at'),
              value: getDateInUTCToTimeZone(segmentationData.UpdatedAt)
            }
          ]}
        />

        <DetailSection title={t('segmentation') + ' ' + t('rules')} className="mt-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-dark-500 dark:bg-dark-800">
            {segmentationData.ParsedRules ? (
              <RuleTreeDisplay
                node={segmentationData.ParsedRules}
                countryMap={countryMap}
                affiliateMap={affiliateMap}
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
