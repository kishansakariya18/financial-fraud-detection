// Clone of deposit transaction edit page; labels/services kept same for now
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../casino-management/currencies/helper';
import { createSchema } from './schema';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';

const EditBankDeposit = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createSchema)
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const result = await CurrencyService.getCurrencyList({
          filters: { status: 'active' },
          pagination: { pageIndex: 0, pageSize: 1000 }
        });
        if (result.status === 200) {
          const mapped = currencyListResponseMapper(result.response);
          const options = (mapped.list || []).map((c) => ({
            value: c.id,
            label: `${c.name} (${c.code})${c.symbol ? ` - ${c.symbol}` : ''}`
          }));
          setCurrencyOptions(options);
        }
      } catch (_) {}
    };

    // Preload existing transaction by id (best effort using list until detail API is available)
    const preload = async () => {
      const result = await UserManualDepositTransactionService.getUserManualDepositTransactionList({
        pagination: { pageIndex: 0, pageSize: 1 },
        keyword: id
      });
      const item = result?.response?.data?.find?.((x) => `${x.UserBankDepositUID}` === id);
      if (item) {
        reset({ amount: item.Amount, currencyID: item.CurrencyID });
      }
    };

    fetchCurrencies();
    preload();
  }, [id, reset]);

  const updateAPI = async (data) => {
    setLoading(true);
    setError(null);

    const payload = {
      id,
      amount: data.amount,
      currencyID: data.currencyID
    };

    const result = await UserManualDepositTransactionService.manualUpdate?.(payload);

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
    toast.success(response.message || 'Updated');
    setTimeout(() => {
      navigate('/user-manual-withdraw-transaction');
    }, 500);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    await updateAPI(data);
  };

  const breadcrumbItem = [
    { title: t('user_manual_deposit_transaction'), path: '/user-manual-withdraw-transaction' },
    { title: t('edit') }
  ];

  return (
    <Page title={t('edit') + ' ' + t('user_manual_deposit_transaction')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('user_manual_deposit_transaction') + ' ' + t('form')}
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
                label={t('amount')}
                error={errors?.amount?.message}
                placeholder={t('enter') + ' ' + t('amount')}
              />
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={currencyOptions}
                    value={currencyOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('currency')}
                    placeholder={t('select') + ' ' + t('currency')}
                    displayField="label"
                    error={errors?.currencyID?.message}
                  />
                )}
                control={control}
                name="currencyID"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditBankDeposit;
