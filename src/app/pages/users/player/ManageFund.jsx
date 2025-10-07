// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Textarea } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import PlayerService from 'services/player.services';
import WalletService from 'services/wallet-services';
import { Listbox } from 'components/shared/form/Listbox';
import TextareaAutosize from 'react-textarea-autosize';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from 'hooks';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import {
  fundTypeOption,
  transactionTypeOption
} from 'components/sections/player-management/helper';
import { manageFundSchema } from 'components/sections/player-management/schema';

const ManageFund = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [show, { toggle }] = useDisclosure();
  const [walletOptions, setWalletOptions] = useState([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  const { playerId } = useParams();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(manageFundSchema)
  });

  // Watch selected transaction type
  const selectedType = watch('type');

  // Filter fund type options based on selected type
  const filteredFundTypeOptions =
    selectedType === 'credit'
      ? fundTypeOption.filter((option) => option.value === 'realCash')
      : selectedType === 'debit'
        ? fundTypeOption.filter((option) => option.value === 'realCash')
        : [];

  const fetchPlayerDetails = async () => {
    setLoading(true);
    const result = await PlayerService.userDetail(playerId);

    if (result.status === 200) {
      // const apiData = result.response.data;
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayerDetails();
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, response]);

  const fetchWalletData = async () => {
    try {
      setIsLoadingWallets(true);
      const result = await WalletService.getWalletList({
        pageIndex: 0,
        pageSize: 100,
        userUID: playerId
      });

      console.log(result.response.data);
      if (result?.response?.data) {
        const formattedWallets = result.response.data.map((wallet) => ({
          value: wallet.Currency != null ? wallet.Currency.CurrencyID : '-',
          label: `${wallet.Currency != null ? wallet.Currency.Code : '-'} (Balance: ${wallet.Balance}) (Bonus: ${wallet.Bonus || 0})`,
          amount: wallet.Balance,
          bonus: wallet.Bonus || 0
        }));
        setWalletOptions(formattedWallets);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error(t('failed_to_load_wallets'));
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const manageFundAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PlayerService.managePlayerFund({
      ...requestObject,
      playerId
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
  const breadcrumbItem = [
    { title: t('players'), path: '/users/player' },
    { title: t('manage') + ' ' + t('fund') }
  ];

  return (
    <Page title={t('manage') + ' ' + t('fund')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {t('manage') + ' ' + t('fund')}
          </h2>
          <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
            <div className="flex justify-between space-x-1">
              <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                {userDetails?.RealCash}
              </p>
              <FaMoneyBill1Wave className="this:success size-5 text-this dark:text-this-light" />
            </div>
            <p className="mt-1 text-xs+">{t('realCash')}</p>
          </div>
          <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
            <div className="flex justify-between space-x-1">
              <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                {userDetails?.Winning}
              </p>
              <FaMoneyBillTransfer className="this:success size-5 text-this dark:text-this-light" />
            </div>
            <p className="mt-1 text-xs+"> {t('winning')}</p>
          </div>
        </div> */}

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

              {/* Currency Dropdown */}
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={walletOptions}
                    value={walletOptions.find((option) => option.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('currency')}
                    placeholder={isLoadingWallets ? t('loading') : t('select_currency')}
                    displayField="label"
                    error={errors?.currency?.message}
                    disabled={isLoadingWallets || walletOptions.length === 0}
                    isLoading={isLoadingWallets}
                  />
                )}
                control={control}
                name="currency"
                rules={{ required: t('currency_is_required') }}
              />

              {/* Fund Type (Conditional Options) */}
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={filteredFundTypeOptions}
                    value={
                      filteredFundTypeOptions.find((option) => option.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('fund') + ' ' + t('type')}
                    placeholder={t('select') + ' ' + t('fund') + ' ' + t('type')}
                    displayField="label"
                    error={errors?.fundType?.message}
                    disabled={filteredFundTypeOptions.length === 0}
                  />
                )}
                control={control}
                name="fundType"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => {
                  const selectedCurrency = walletOptions
                    .find((w) => w.value === watch('currency'))
                    ?.label?.split(' ')[0];

                  return (
                    <Input
                      {...field}
                      prefix={
                        selectedCurrency && (
                          <span className="m-8 flex items-center text-sm font-medium">
                            {selectedCurrency}
                          </span>
                        )
                      }
                      label={t('amount')}
                      type="number"
                      error={errors?.amount?.message}
                      placeholder={t('enter') + ' ' + t('amount')}
                      step="any"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                    />
                  );
                }}
              />
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
                type={show ? 'text' : 'password'}
                label={t('transaction') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('transaction') + ' ' + t('password')}
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
