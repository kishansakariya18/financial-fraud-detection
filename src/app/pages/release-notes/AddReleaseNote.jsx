import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import { Button, Input, Textarea } from 'components/ui';
import { DatePicker } from 'components/shared/form/Datepicker';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { addReleaseNoteSchema } from './schema';
import ReleaseNotesService from 'services/release-notes.services';

const AddReleaseNote = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = `${t('add')} ${t('release_note')}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    resolver: yupResolver(addReleaseNoteSchema),
    defaultValues: {
      version: '',
      title: '',
      description: '',
      releaseDate: ''
    }
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue
  } = form;
  const versionValue = watch('version');

  useEffect(() => {
    if (versionValue && !versionValue.startsWith('v') && versionValue.match(/^\d+\.\d+\.\d+$/)) {
      setValue('version', `v${versionValue}`);
    }
  }, [versionValue, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const submitData = { ...data };
      if (submitData.version && !submitData.version.startsWith('v')) {
        submitData.version = `v${submitData.version}`;
      }

      console.log('Submitting release note:', submitData);

      const result = await ReleaseNotesService.createReleaseNotes(submitData);

      if (result.status === 200 || result.status === 201) {
        toast.success(result.response.message);
        setTimeout(() => {
          navigate('/release-notes');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(error.message || 'Failed to create release note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset({
      version: '',
      title: '',
      description: '',
      releaseDate: ''
    });
  };

  useEffect(() => {
    if (submitError) {
      toast.error(submitError, { invert: true });
      setSubmitError(null);
    }
  }, [submitError]);
  const breadcrumbItem = [
    { title: t('release_notes'), path: '/release-notes' },
    { title: t('add') }
  ];

  return (
    <Page title={pageTitle}>
      <div className="transition-content px-[--margin-x] pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {pageTitle}
            </h2>
            <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
              <div className="hidden self-stretch py-1 sm:flex">
                <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
              </div>
              <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
            </div>
          </div>
        </div>

        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="add-release-note-form"
          className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            <Input
              {...register('version')}
              label={t('version')}
              placeholder="1.0.0"
              error={errors?.version?.message}
            />

            <Input
              {...register('title')}
              label={t('title')}
              placeholder={t('enter') + ' ' + t('title')}
              error={errors?.title?.message}
            />

            <Controller
              name="releaseDate"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  onChange={onChange}
                  value={value || ''}
                  label={t('release_date')}
                  error={errors?.releaseDate?.message}
                  options={{
                    disableMobile: true,
                    time_24hr: true,
                    minDate: 'today'
                  }}
                  placeholder="Choose date..."
                  {...rest}
                />
              )}
            />
            <div className="space-y-2">
              <Textarea
                {...register('description')}
                placeholder={t('enter') + ' ' + t('description')}
                label={t('description')}
                error={errors?.description?.message}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" className="min-w-[7rem]" onClick={handleReset}>
              {t('reset')}
            </Button>
            <Button
              className="min-w-[7rem]"
              type="submit"
              color="primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}>
              {t('save')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default AddReleaseNote;
