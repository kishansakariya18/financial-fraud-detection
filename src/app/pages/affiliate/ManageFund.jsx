// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Textarea } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import TextareaAutosize from 'react-textarea-autosize';
import { EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { manageFundSchema } from './schema';
import { useParams } from 'react-router';
import AffiliateService from 'services/affiliate.services';
import { transactionTypeOption } from '../users/player/helper';
import { EyeSlashIcon } from '@heroicons/react/20/solid';
import { useDisclosure } from 'hooks';
import { FaMoneyBill1Wave } from 'react-icons/fa6';

const ManageFund = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [show, { toggle }] = useDisclosure();

  const { affiliateId } = useParams();
  const { t } = useTranslation();

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

  const fetchAffiliateDetails = async () => {
    setLoading(true);
    const result = await AffiliateService.getAffiliateDetail(affiliateId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setAffiliate(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAffiliateDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateId, response]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    fetchAffiliateDetails();
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
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
            <div className="flex justify-between space-x-1">
              <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                {affiliate?.CommissionBalance}
              </p>
              <FaMoneyBill1Wave className="this:success size-5 text-this dark:text-this-light" />
            </div>
            <p className="mt-1 text-xs+">{t('commission') + ' ' + t('balance')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
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
                label={t('transaction') + ' ' + t('password')}
                type={show ? 'text' : 'password'}
                placeholder={t('enter') + ' ' + t('transaction') + ' ' + t('password')}
                prefix={<LockClosedIcon className="size-4.5" />}
                suffix={
                  <Button
                    variant="flat"
                    className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                    onClick={toggle}>
                    {show ? (
                      <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                    ) : (
                      <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                    )}
                  </Button>
                }
                {...register('password')}
                error={errors?.password?.message}
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
