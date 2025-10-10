// Clone of deposit transaction create page; labels/services kept same for now
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../casino-management/currencies/helper';
import { createSchema } from './schema';
import UserManualDepositTransactionService from 'services/user-manual-deposit-transaction.services';

const AddBankDeposit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('user_manual_deposit_transaction'), path: '/user-manual-withdraw-transaction' },
    { title: t('create') }
  ];

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

  const [currencyOptions, setCurrencyOptions] = useState([]);

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
        } else {
          toast.error(result.error || 'Failed to load currencies');
        }
      } catch (e) {
        // ignore
      }
    };
    fetchCurrencies();
  }, []);

  const createAPI = async (data) => {
    setLoading(true);
    setError(null);

    // This mirrors the deposit flow; adjust when withdraw endpoints are provided
    const payload = {
      amount: data.amount,
      currencyID: data.currencyID
    };

    const result = await UserManualDepositTransactionService.manualCreate?.(payload);

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
    toast.success(response.message || 'Created');
    setTimeout(() => {
      navigate('/user-manual-withdraw-transaction');
    }, 0);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    await createAPI(data);
  };

  return (
    <Page title={t('create') + ' ' + t('user_manual_deposit_transaction')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('user_manual_deposit_transaction') + ' ' + t('form')}
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
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
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

export default AddBankDeposit;
