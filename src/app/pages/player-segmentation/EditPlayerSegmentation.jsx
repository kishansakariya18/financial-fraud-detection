// Import Dependencies
import { Page } from 'components/shared/Page';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import CreateOrEditFormPlayerSegmentation from 'components/sections/player-segmentation/CreateOrEditForm';
import PlayerSegmentationService from 'services/player-segmentation.services';
import { createDefaultRuleTree } from 'components/sections/player-segmentation/ruleUtils';

const EditPlayerSegmentation = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { segmentationUID } = useParams();

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: t('edit') }
  ];

  // Fetch segmentation details
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
          // Map API response
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
              toast.warning(t('rules_parse_error') || 'Error parsing rules, using default');
            }
          }

          const mappedData = {
            segmentationUID: data.SegmentationUID,
            segmentName: data.SegmentName || '',
            segmentDescription: data.SegmentDescription || '',
            segmentTag: data.SegmentTag || '',
            segmentRules: parsedRules,
            isScheduled: data.IsScheduled === 1,
            isActive: data.IsActive,
            evaluationFrequency: data.EvaluationFrequency || 'DAILY'
          };

          setInitialData(mappedData);
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

  const handleSuccess = () => {
    navigate('/bonus/player-segmentation');
  };

  const handleCancel = () => {
    navigate('/bonus/player-segmentation');
  };

  if (loading) {
    return (
      <Page title={t('edit') + ' ' + t('player_segmentation')}>
        <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              {t('edit') + ' ' + t('player_segmentation') + ' ' + t('form')}
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {t('loading') || 'Loading'}...
              </p>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title={t('edit') + ' ' + t('player_segmentation')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('player_segmentation') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {initialData && (
          <CreateOrEditFormPlayerSegmentation
            mode="edit"
            initialData={initialData}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </Page>
  );
};

export default EditPlayerSegmentation;
