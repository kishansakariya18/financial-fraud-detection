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
  // const currencyTypeOptions = [
  //   { value: 'Fiat', label: 'Fiat' },
  //   { value: 'Crypto', label: 'Crypto' },
  //   { value: 'Points', label: 'Points' }
  // ];
  const [codes, setCodes] = useState([]);
  const [codesLoading, setCodesLoading] = useState(false);
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

  // Fetch currency codes for dropdown
  useEffect(() => {
    const fetchCodes = async () => {
      setCodesLoading(true);
      const res = await CurrencyService.getCurrencyCodes();
      if (res) {
        if (res.status === 200) {
          const data = res.response?.data ?? res.response?.codes ?? res.response ?? [];
          setCodes(data);
        } else if (res.error) {
          toast.error(res.error);
        }
      }
      setCodesLoading(false);
    };
    fetchCodes();
  }, []);

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
    // Derive currencyType from selected code
    const selected = codes.find((c) => c.AlphabeticName === data.code);
    const currencyType = selected?.CurrencyType;
    const requestObject = { ...data, currencyType };
    console.log('Submit payload:', requestObject);
    await createCurrencyAPI(requestObject);
  };

  // Placeholder text for currency code dropdown (lint-friendly)
  const codePlaceholder = codesLoading ? t('loading') + '...' : t('select') + ' ' + t('code');

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
              <Controller
                name="Code"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={codes}
                    value={codes.find((opt) => opt.AlphabeticName === field.value) || null}
                    onChange={(val) => {
                      field.onChange(val.AlphabeticName);
                      const currencyType = val.CurrencyType; // store in a variable
                      console.log('Selected CurrencyType:', currencyType);
                    }}
                    name={field.name}
                    label={t('code')}
                    placeholder={codePlaceholder}
                    displayField="AlphabeticName"
                    error={errors.code?.message}
                    disabled={codesLoading}
                    required
                  />
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('symbol')}
                label={t('symbol')}
                error={errors?.symbol?.message}
                placeholder={t('enter') + ' ' + t('symbol')}
              />
              {/* <Controller
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
              /> */}
              <Input
                {...register('decimal_places')}
                label={t('decimal_places')}
                type="number"
                error={errors?.decimal_places?.message}
                placeholder={t('enter') + ' ' + t('decimal_places')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2"></div>
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
