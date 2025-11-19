// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { Button, Input } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';

const CreatePlayerSegmentation = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const breadcrumbItem = [
    { title: t('player_segmentation'), path: '/player-segmentation' },
    { title: t('create') }
  ];

  // TODO: Add form state and validation
  const [formData, setFormData] = useState({
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Add API call here
    try {
      // Placeholder - API call will be added later
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        t('player_segmentation_created_successfully') || 'Player segmentation created successfully'
      );
      navigate('/bonus/player-segmentation');
    } catch (error) {
      toast.error(error?.message || t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                prefix={<UserIcon className="size-5" />}
                placeholder={t('enter') + ' ' + t('name')}
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={() => navigate('/bonus/player-segmentation')}
              disabled={loading}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreatePlayerSegmentation;
