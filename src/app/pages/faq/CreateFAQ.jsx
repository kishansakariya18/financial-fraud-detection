import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { Page } from 'components/shared/Page';
import { Button, Input, Textarea } from 'components/ui';
import { Select } from 'components/ui/Form/Select';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

import FaqService from 'services/faq.services';
import { moduleOptions } from './helper';
import { createFaqSchema } from './schema';

const CreateFAQ = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = `${t('add')} ${t('faq')}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    resolver: yupResolver(createFaqSchema),
    defaultValues: {
      question: '',
      answer: '',
      module: '',
      sortOrder: '0'
    }
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = form;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        question: data.question.trim(),
        answer: data.answer.trim(),
        module: data.module,
        sortOrder: '0'
      };

      const result = await FaqService.create(payload);
      if (result && (result.status === 200 || result.status === 201)) {
        toast.success(result.response?.message || t('create_success'));
        setTimeout(() => navigate('/faq'), 500);
      } else {
        toast.error(result?.error || result?.response?.message || t('create_failed'));
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to create FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset({ question: '', answer: '', module: '', sortOrder: '0' });
  };

  useEffect(() => {
    if (submitError) {
      toast.error(submitError, { invert: true });
      setSubmitError(null);
    }
  }, [submitError]);

  const breadcrumbItem = [{ title: t('faq'), path: '/faq' }, { title: t('add') }];

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
          id="add-faq-form"
          className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            <Input
              {...register('question')}
              label={t('question')}
              placeholder={t('enter') + ' ' + t('question')}
              error={errors?.question?.message}
            />

            <Controller
              name="module"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  data={[
                    { value: '', label: t('select') + ' ' + t('module'), disabled: true },
                    ...moduleOptions
                  ]}
                  label={t('module')}
                  placeholder={t('select') + ' ' + t('module')}
                  error={errors?.module?.message}
                />
              )}
            />

            {/* <Input
              type="number"
              {...register('sortOrder')}
              label={t('sort_order')}
              placeholder={t('enter') + ' ' + t('sort_order')}
              error={errors?.sortOrder?.message}
            /> */}
          </div>

          <div className="space-y-2">
            <Textarea
              {...register('answer')}
              placeholder={t('enter') + ' ' + t('answer')}
              label={t('answer')}
              error={errors?.answer?.message}
              rows={12}
            />
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

export default CreateFAQ;
