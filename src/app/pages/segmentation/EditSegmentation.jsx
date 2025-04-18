// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import SegmentationService from 'services/segmentation.services';
import { genderOptions, kycOptions } from './helper';
import { createSegmentationSchema } from './schema';

const EditSegmentation = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('segmentation'), path: '/segmentation' },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createSegmentationSchema)
  });

  const { segmentationId } = useParams();

  const kyc = watch('kyc');
  const countryCheck = watch('countryCheck');
  const ageGroup = watch('ageGroup');
  const genderCheck = watch('genderCheck');
  const loginCounter = watch('loginCounter');
  const referral = watch('referral');
  const moneyDeposit = watch('moneyDeposit');
  const moneyWon = watch('moneyWon');
  const moneyLoss = watch('moneyLoss');

  const fetchCountryList = async () => {
    setLoading(true);
    const result = await SegmentationService.getCountries();

    if (result) {
      if (result.status === 200 || result.status === 201) {
        let countryList = result?.response?.data.map((country) => {
          return { value: country.CountryID, label: country.CountryName };
        });

        setCountryOptions(countryList);
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  const fetchSegmentationDetails = async () => {
    const result = await SegmentationService.getSegmentationDetails(segmentationId);

    if (result.status === 200) {
      return result.response.data;
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    console.log('called');
    if (segmentationId) {
      fetchSegmentationDetails().then((result) => {
        if (result) {
          const mappedData = {
            name: result?.Name,

            // Gender
            genderCheck: result?.Filters?.GenderCheck === 'on',
            gender: result?.Filters?.Gender || null,

            // Age
            ageGroup: result?.Filters?.AgeCheck === 'on',
            minAge: result?.Filters?.MinAge ? Number(result?.Filters?.MinAge) : null,
            maxAge: result?.Filters?.MaxAge ? Number(result?.Filters?.MaxAge) : null,

            // KYC
            kyc: result?.Filters?.KYCCheck === 'on',
            kycType: result?.Filters?.KYC ? Number(result?.Filters?.KYC) : null,

            // Country
            countryCheck: result?.Filters?.CountryCheck === 'on',
            countries: result?.Filters?.Countries ? Number(result?.Filters?.Countries) : null,

            // Login Counter
            loginCounter: result?.Filters?.LoginCounterCheck === 'on',
            minLoginCount: result?.Filters?.MinLoginCount
              ? Number(result?.Filters?.MinLoginCount)
              : null,
            maxLoginCount: result?.Filters?.MaxLoginCount
              ? Number(result?.Filters?.MaxLoginCount)
              : null,

            // Referral
            referral: result?.Filters?.RefCheck === 'on',
            minReferral: result?.Filters?.RefMin ? Number(result?.Filters?.RefMin) : null,
            maxReferral: result?.Filters?.RefMax ? Number(result?.Filters?.RefMax) : null,

            // Money Deposit
            moneyDeposit: result?.Filters?.MoneyDepositCheck === 'on',
            minDeposit: result?.Filters?.MinMonDep ? Number(result?.Filters?.MinMonDep) : null,
            maxDeposit: result?.Filters?.MaxMonDep ? Number(result?.Filters?.MaxMonDep) : null,

            // Money Won
            moneyWon: result?.Filters?.MoneyWonCheck === 'on',
            minWon: result?.Filters?.MaxMonWon ? Number(result?.Filters?.MaxMonWon) : null,
            maxWon: result?.Filters?.MaxMonWon ? Number(result?.Filters?.MaxMonWon) : null,

            // Money Loss
            moneyLoss: result?.Filters?.MoneyLossCheck === 'on',
            minLoss: result?.Filters?.MinMonLoss ? Number(result?.Filters?.MinMonLoss) : null,
            maxLoss: result?.Filters?.MaxMonLoss ? Number(result?.Filters?.MaxMonLoss) : null
          };

          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentationId]);

  console.log('seg id: ', segmentationId);

  useEffect(() => {
    fetchCountryList();
  }, []);

  const editSegmentationAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await SegmentationService.addEditSegmentationList(requestObject);
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
  }

  const onSubmit = async (data) => {
    await editSegmentationAPI({ segmentationId, ...data });
  };
  return (
    <Page title={t('edit') + ' ' + t('segmentation')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('segmentation') + ' ' + t('form')}
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
                prefix={<UserIcon className="size-5" />}
                label={t('name')}
                error={errors?.name?.message}
                placeholder={t('enter') + ' ' + t('name')}
              />
            </div>
          </div>
          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('segmentation') + ' ' + t('setting')}
          </h6>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('kyc')} {...register('kyc')} />
              </div>

              {kyc && (
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={kycOptions}
                          value={kycOptions.find((opt) => opt.value === field.value) || null}
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          placeholder={t('select') + ' ' + t('kyc') + ' ' + t('option')}
                          displayField="label"
                          error={errors?.playerLossCommissionType?.message}
                        />
                      )}
                      control={control}
                      name="kycType"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('countries')} {...register('countryCheck')} />
              </div>

              {countryCheck && (
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={countryOptions}
                          value={countryOptions.find((opt) => opt.value === field.value) || null}
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          placeholder={t('select') + ' ' + t('countries')}
                          displayField="label"
                          error={errors?.countries?.message}
                        />
                      )}
                      control={control}
                      name="countries"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('age') + ' ' + t('group')} {...register('ageGroup')} />
              </div>
              {ageGroup && (
                <>
                  <Input
                    {...register('minAge')}
                    error={errors?.minAge?.message}
                    placeholder={t('enter') + ' ' + t('minimum') + ' ' + t('age')}
                    type="number"
                  />
                  <Input
                    {...register('maxAge')}
                    error={errors?.maxAge?.message}
                    placeholder={t('enter') + ' ' + t('maximum') + ' ' + t('age')}
                    type="number"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('gender')} {...register('genderCheck')} />
              </div>
              {genderCheck && (
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={genderOptions}
                      value={genderOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      placeholder={t('select') + ' ' + t('gender')}
                      displayField="label"
                      error={errors?.gender?.message}
                    />
                  )}
                  control={control}
                  name="gender"
                />
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('login') + ' ' + t('counter')} {...register('loginCounter')} />
              </div>
              {loginCounter && (
                <>
                  <Input
                    {...register('minLoginCount')}
                    error={errors?.minLoginCount?.message}
                    placeholder={t('minimum') + ' ' + t('login') + ' ' + t('count')}
                    type="number"
                  />
                  <Input
                    {...register('maxLoginCount')}
                    error={errors?.maxLoginCount?.message}
                    placeholder={t('maximum') + ' ' + t('login') + ' ' + t('count')}
                    type="number"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('referral')} {...register('referral')} />
              </div>
              {referral && (
                <>
                  <Input
                    {...register('minReferral')}
                    error={errors?.minReferral?.message}
                    placeholder={t('minimum') + ' ' + t('referral') + ' ' + t('count')}
                    type="number"
                  />
                  <Input
                    {...register('maxReferral')}
                    error={errors?.maxReferral?.message}
                    placeholder={t('maximum') + ' ' + t('referral') + ' ' + t('count')}
                    type="number"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('deposit')} {...register('moneyDeposit')} />
              </div>
              {moneyDeposit && (
                <>
                  <Input
                    {...register('minDeposit')}
                    error={errors?.minDeposit?.message}
                    placeholder={t('minimum') + ' ' + t('deposit')}
                    type="number"
                  />
                  <Input
                    {...register('maxDeposit')}
                    error={errors?.maxDeposit?.message}
                    placeholder={t('maximum') + ' ' + t('deposit')}
                    type="number"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('won')} {...register('moneyWon')} />
              </div>
              {moneyWon && (
                <>
                  <Input
                    {...register('minWon')}
                    error={errors?.minWon?.message}
                    placeholder={t('minimum') + ' ' + t('won')}
                    type="number"
                  />
                  <Input
                    {...register('maxWon')}
                    error={errors?.maxWon?.message}
                    placeholder={t('maximum') + ' ' + t('won')}
                    type="number"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('loss')} {...register('moneyLoss')} />
              </div>
              {moneyLoss && (
                <>
                  <Input
                    {...register('minLoss')}
                    error={errors?.minLoss?.message}
                    placeholder={t('minimum') + ' ' + t('loss')}
                    type="number"
                  />
                  <Input
                    {...register('maxLoss')}
                    error={errors?.maxLoss?.message}
                    placeholder={t('maximum') + ' ' + t('loss')}
                    type="number"
                  />
                </>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('edit')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditSegmentation;
