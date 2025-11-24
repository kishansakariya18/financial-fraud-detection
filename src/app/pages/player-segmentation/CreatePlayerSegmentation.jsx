// Import Dependencies
import { Page } from 'components/shared/Page';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import CreateOrEditFormPlayerSegmentation from 'components/sections/player-segmentation/CreateOrEditForm';

const CreatePlayerSegmentation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/player-segmentation' },
    { title: t('create') }
  ];

  return (
    <Page title={t('create') + ' ' + t('player_segmentation')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('player_segmentation') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <CreateOrEditFormPlayerSegmentation
          mode="create"
          onSuccess={() => navigate('/bonus/player-segmentation')}
          onCancel={() => navigate('/bonus/player-segmentation')}
        />
      </div>
    </Page>
  );
};

export default CreatePlayerSegmentation;
