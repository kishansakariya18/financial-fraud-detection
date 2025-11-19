// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';

const ViewPlayerSegmentation = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/bonus/player-segmentation' },
    { title: t('view') }
  ];

  // TODO: Add form state
  const [formData, setFormData] = useState({
    name: ''
  });

  // TODO: Add API call to fetch data
  useEffect(() => {
    if (id) {
      setFormData({
        name: 'Player Segmentation'
      });
      // Placeholder - API call will be added later
      // fetchPlayerSegmentationDetails(id).then((data) => {
      //   setFormData(data);
      // });
    }
  }, [id]);

  return (
    <Page title={t('view') + ' ' + t('player_segmentation')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('view') + ' ' + t('player_segmentation') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('name')}
                value={formData.name}
                prefix={<UserIcon className="size-5" />}
                placeholder={t('name')}
                disabled
              />
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default ViewPlayerSegmentation;
