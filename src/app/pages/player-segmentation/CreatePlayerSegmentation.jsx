// Import Dependencies
import { useEffect, useState } from 'react';
import { Page } from 'components/shared/Page';
import { useNavigate, useSearchParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CreateOrEditFormPlayerSegmentation from 'components/sections/player-segmentation/CreateOrEditForm';
import PlayerSegmentationService from 'services/player-segmentation.services';

const CreatePlayerSegmentation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cloneId = searchParams.get('cloneId');
  const [cloneData, setCloneData] = useState(null);
  const [loading, setLoading] = useState(false);

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: cloneId ? t('clone') : t('create') }
  ];

  useEffect(() => {
    if (cloneId) {
      setLoading(true);
      PlayerSegmentationService.detail(cloneId)
        .then(({ response }) => {
          if (response?.data) {
            // Prepare clone data - remove IDs and set to inactive
            const data = response.data;
            setCloneData({
              segmentName: data.SegmentName,
              segmentDescription: data.SegmentDescription || '',
              segmentTag: data.SegmentTag || '',
              segmentRules: data.SegmentRules,
              isScheduled: data.IsScheduled === 1,
              isActive: data.IsActive === 1,
              evaluationFrequency: data.EvaluationFrequency || 'DAILY'
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching segmentation for clone:', error);
          toast.error(error);
          navigate('/bonus/player-segmentation');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [cloneId, navigate, t]);

  return (
    <Page title={(cloneId ? t('clone') : t('create')) + ' ' + t('player_segmentation')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {(cloneId ? t('clone') : t('create')) +
              ' ' +
              t('player_segmentation') +
              ' ' +
              t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">{t('loading')}...</div>
          </div>
        ) : (
          <CreateOrEditFormPlayerSegmentation
            mode="create"
            initialData={cloneData}
            onSuccess={() => navigate('/bonus/player-segmentation')}
            onCancel={() => navigate('/bonus/player-segmentation')}
          />
        )}
      </div>
    </Page>
  );
};

export default CreatePlayerSegmentation;
