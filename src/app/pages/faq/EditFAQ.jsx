import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { Page } from 'components/shared/Page';
import { Button, Input, Textarea } from 'components/ui';
import { Select } from 'components/ui/Form/Select';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

import FaqService from 'services/faq.services';
import { moduleOptions } from './helper';
import { editFaqSchema } from './schema';

const EditFAQ = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { faqUID } = useParams();
  const location = useLocation();
  const pageTitle = `${t('edit')} ${t('faq')}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const statusOptions = useMemo(
    () => [
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' }
    ],
    []
  );

  const defaultDetail = location?.state?.detail || null;

  const form = useForm({
    resolver: yupResolver(editFaqSchema),
    defaultValues: {
      question: defaultDetail?.question || '',
      answer: defaultDetail?.answer || '',
      module: defaultDetail?.module || '',
      status:
        defaultDetail?.status === 'active' ? '1' : defaultDetail?.status === 'inactive' ? '0' : '',
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

  useEffect(() => {
    if (defaultDetail) {
      reset({
        question: defaultDetail?.question || '',
        answer: defaultDetail?.answer || '',
        module: defaultDetail?.module || '',
        status:
          defaultDetail?.status === 'active'
            ? '1'
            : defaultDetail?.status === 'inactive'
              ? '0'
              : '',
        sortOrder: '0'
      });
    }
  }, [defaultDetail, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        faqUID: faqUID || defaultDetail?.id,
        question: data.question.trim(),
        answer: data.answer.trim(),
        module: data.module,
        faqStatus: String(data.status),
        sortOrder: '0'
      };

      const result = await FaqService.update(payload);
      if (result && (result.status === 200 || result.status === 201)) {
        toast.success(result.response?.message || t('update_success'));
        setTimeout(() => navigate('/faq'), 500);
      } else {
        toast.error(result?.error || result?.response?.message || t('update_failed'));
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to update FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (defaultDetail) {
      reset({
        question: defaultDetail?.question || '',
        answer: defaultDetail?.answer || '',
        module: defaultDetail?.module || '',
        status:
          defaultDetail?.status === 'active'
            ? '1'
            : defaultDetail?.status === 'inactive'
              ? '0'
              : '',
        sortOrder: '0'
      });
    }
  };

  useEffect(() => {
    if (submitError) {
      toast.error(submitError, { invert: true });
      setSubmitError(null);
    }
  }, [submitError]);

  const breadcrumbItem = [{ title: t('faq'), path: '/faq' }, { title: t('edit') }];

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
          id="edit-faq-form"
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
                  data={moduleOptions}
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

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  data={statusOptions}
                  label={t('status')}
                  placeholder={t('select') + ' ' + t('status')}
                  error={errors?.status?.message}
                />
              )}
            />
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
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditFAQ;
