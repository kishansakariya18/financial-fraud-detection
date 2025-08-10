import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createCurrencySchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Listbox } from 'components/shared/form/Listbox';
import CurrencyService from 'services/currency.services';

const CreateCurrency = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const currencyTypeOptions = [
    { value: 'Fiat', label: 'Fiat' },
    { value: 'Crypto', label: 'Crypto' },
    { value: 'Points', label: 'Points' }
  ];
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('currencies'), path: '/casino-management/currencies' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    resolver: yupResolver(createCurrencySchema)
  });

  const createCurrencyAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await CurrencyService.createCurrency(requestObject); // Assuming this function exists
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

  useEffect(() => {
    if (!loading && !error && response) {
      toast.success(response.message);
      setResponse(null);
      reset();
      navigate('/casino-management/currencies');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const onSubmit = async (data) => {
    await createCurrencyAPI(data);
  };

  return (
    <Page title={t('create') + ' ' + t('currency')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('currency') + ' ' + t('form')}
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
                {...register('name')}
                label={t('name')}
                error={errors?.name?.message}
                placeholder={t('enter') + ' ' + t('name')}
              />
              <Input
                {...register('code')}
                label={t('code')}
                error={errors?.code?.message}
                placeholder={t('enter') + ' ' + t('code')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('symbol')}
                label={t('symbol')}
                error={errors?.symbol?.message}
                placeholder={t('enter') + ' ' + t('symbol')}
              />
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={currencyTypeOptions}
                    value={currencyTypeOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('type')}
                    placeholder={t('select') + ' ' + t('type')}
                    displayField="label"
                    error={errors.type?.message}
                    required
                  />
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('decimal_places')}
                label={t('decimal_places')}
                type="number"
                error={errors?.decimal_places?.message}
                placeholder={t('enter') + ' ' + t('decimal_places')}
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

export default CreateCurrency;
