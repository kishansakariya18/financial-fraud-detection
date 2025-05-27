// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Textarea } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import TextareaAutosize from 'react-textarea-autosize';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { manageFundSchema } from './schema';
import { useParams } from 'react-router';
import AffiliateService from 'services/affiliate.services';
import { transactionTypeOption } from '../users/player/helper';

const ManageFund = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const { affiliateId } = useParams();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliate' },
    { title: t('manage') + ' ' + t('fund') }
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(manageFundSchema)
  });

  // Watch selected transaction type
  const manageFundAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AffiliateService.manageAffiliateFund({
      ...requestObject,
      affiliateUID: affiliateId
    });
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    reset();
  }

  const onSubmit = async (data) => {
    await manageFundAPI(data);
  };

  return (
    <Page title={t('manage') + ' ' + t('fund')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('manage') + ' ' + t('fund')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Transaction Type */}
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={transactionTypeOption}
                    value={transactionTypeOption.find((type) => type.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('type')}
                    placeholder={t('select') + ' ' + t('type')}
                    displayField="label"
                    error={errors?.type?.message}
                  />
                )}
                control={control}
                name="type"
              />
              <Input
                {...register('amount')}
                prefix={<TbCoinRupeeFilled className="size-5" />}
                label={t('amount')}
                type="number"
                error={errors?.amount?.message}
                placeholder={t('enter') + ' ' + t('amount')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea
                {...register('fundMessage')}
                component={TextareaAutosize}
                minRows={5}
                label={t('fund') + ' ' + t('message')}
                error={errors?.fundMessage?.message}
                placeholder={t('enter') + ' ' + t('fund') + ' ' + t('message')}
              />
            </div>

            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>

            <div className="grid sm:grid-cols-2">
              <Input
                {...register('password')}
                prefix={<LockClosedIcon className="size-5" />}
                label={t('transaction') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('transaction') + ' ' + t('password')}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('add')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default ManageFund;
