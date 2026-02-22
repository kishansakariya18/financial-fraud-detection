// Import Dependencies
import { Page } from 'components/shared/Page';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  //   MapPinIcon,
  //   GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Input } from 'components/ui';
import { createTransactionSchema } from './schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TRANSACTION_TYPES, PAYMENT_METHODS, TRANSACTION_CATEGORIES } from './constants';
import TransactionService from 'services/transactions.services';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

const CreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const breadcrumbItem = [
    { title: t('transactions'), path: '/transactions' },
    { title: t('create') }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    resolver: yupResolver(createTransactionSchema),
    defaultValues: {
      transactionDate: dayjs().toDate(),
      type: 'INCOME',
      paymentMethod: 'UPI'
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        userId: userData?.UserID || userData?.id, // Use UserID or id based on authentication structure
        fraudStatus: 'PENDING',
        fraudScore: 0,
        transactionDate: data.transactionDate.toISOString()
      };

      const response = await TransactionService.createTransaction(payload);
      toast.success(response.message || 'Transaction created successfully');
      navigate('/transactions');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Page title={t('create') + ' ' + t('transaction')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('transaction')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('amount')}
                type="number"
                prefix={<CurrencyDollarIcon className="size-5" />}
                label={t('amount')}
                error={errors?.amount?.message}
                placeholder={t('enter') + ' ' + t('amount')}
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={TRANSACTION_TYPES}
                    value={TRANSACTION_TYPES.find((type) => type.value === field.value) || null}
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={TRANSACTION_CATEGORIES}
                    value={TRANSACTION_CATEGORIES.find((cat) => cat.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('category')}
                    placeholder={t('select') + ' ' + t('category')}
                    displayField="label"
                    error={errors?.categoryId?.message}
                  />
                )}
                control={control}
                name="categoryId"
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={PAYMENT_METHODS}
                    value={PAYMENT_METHODS.find((pm) => pm.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={'Payment Method'}
                    placeholder={'Select Payment Method'}
                    displayField="label"
                    error={errors?.paymentMethod?.message}
                  />
                )}
                control={control}
                name="paymentMethod"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('transactionDate')}
                type="date"
                prefix={<CalendarIcon className="size-5" />}
                label={'Transaction Date'}
                error={errors?.transactionDate?.message}
                defaultValue={dayjs().format('YYYY-MM-DD')}
              />
              <Input
                {...register('description')}
                prefix={<DocumentTextIcon className="size-5" />}
                label={'Description'}
                error={errors?.description?.message}
                placeholder={'Enter Description'}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* <Input
                {...register('location.city')}
                prefix={<MapPinIcon className="size-5" />}
                label={t('city')}
                error={errors?.location?.city?.message}
                placeholder={t('enter') + ' ' + t('city')}
              />
              <Input
                {...register('location.country')}
                prefix={<GlobeAltIcon className="size-5" />}
                label={'Country'}
                error={errors?.location?.country?.message}
                placeholder={'Enter Country'}
              /> */}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button
              type="submit"
              className="min-w-[7rem]"
              color="primary"
              loading={loading}
              disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateTransaction;
