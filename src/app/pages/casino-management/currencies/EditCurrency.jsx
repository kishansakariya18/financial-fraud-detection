import { Page } from 'components/shared/Page';
import { t } from 'i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/ui';
import { Input } from 'components/ui';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Listbox } from 'components/shared/form/Listbox';
import CurrencyService from 'services/currency.services';
import { createCurrencySchema } from './schema';

const EditCurrency = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currencyId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: t('currencies'), path: '/casino-management/currencies' },
    { title: t('edit') }
  ];

  const currencyTypeOptions = [
    { value: 'Fiat', label: 'Fiat' },
    { value: 'Crypto', label: 'Crypto' },
    { value: 'Points', label: 'Points' }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(createCurrencySchema)
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      if (!currencyId) return;
      try {
        setLoading(true);
        setError('');
        const result = await CurrencyService.getCurrencyById(currencyId);
        if (result) {
          reset({
            name: result.name,
            code: result.code,
            symbol: result.symbol,
            type: result.type,
            decimal_places: result.decimal_places
          });
        } else {
          setError(t('invalid_response_format'));
        }
      } catch (err) {
        setError(err.message || t('something_went_wrong'));
        toast.error(err.message || t('something_went_wrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, [currencyId, reset]);

  const updateCurrency = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await CurrencyService.updateCurrency(currencyId, data);
      if (result.status === 200 || result.status === 201) {
        toast.success('Currency updated successfully!');
        navigate('/casino-management/currencies');
      } else {
        setError(result.error || t('something_went_wrong'));
      }
    } catch (err) {
      setError(err.message || t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <Page title={t('edit') + ' ' + t('currency')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('currency')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <form onSubmit={handleSubmit(updateCurrency)} className="space-y-6">
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
            <Button
              className="min-w-[7rem]"
              onClick={() => navigate('/casino-management/currencies')}
              disabled={loading}
              variant="outlined">
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="min-w-[7rem]"
              color="primary"
              loading={loading}
              disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditCurrency;
