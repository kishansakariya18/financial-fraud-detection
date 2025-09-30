// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import SegmentationService from 'services/segmentation.services';
import { genderOptions, kycOptions } from './helper';
import { createSegmentationSchema } from './schema';
import { useCurrencyContext } from 'app/contexts/currency/context';

const EditSegmentation = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const { symbol } = useCurrencyContext();

  const breadcrumbItem = [
    { title: t('segmentation'), path: '/segmentation' },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createSegmentationSchema)
  });

  const { segmentationUID } = useParams();

  const kyc = watch('kyc');
  const countryCheck = watch('countryCheck');
  const ageGroup = watch('ageGroup');
  const genderCheck = watch('genderCheck');
  const loginCounter = watch('loginCounter');
  const referral = watch('referral');
  const moneyDeposit = watch('moneyDeposit');
  const moneyWon = watch('moneyWon');
  const moneyLoss = watch('moneyLoss');
  const navigate = useNavigate();

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
    const result = await SegmentationService.getSegmentationDetails(segmentationUID);

    if (result.status === 200) {
      return result.response.data;
    } else {
      setError(result.error);
    }
  };
  useEffect(() => {
    console.log('countryCheck:', countryCheck);

    if (!kyc) setValue('kycType', null);
    if (!countryCheck) setValue('countries', null);

    if (!ageGroup) setValue('minAge', null);
    if (!ageGroup) setValue('maxAge', null);

    if (!genderCheck) setValue('gender', null);

    if (!loginCounter) setValue('maxLoginCount', null);
    if (!loginCounter) setValue('minLoginCount', null);

    if (!referral) setValue('minReferral', null);
    if (!referral) setValue('maxReferral', null);

    if (!moneyDeposit) setValue('maxDeposit', null);
    if (!moneyDeposit) setValue('minDeposit', null);

    if (!moneyWon) setValue('maxWon', null);
    if (!moneyWon) setValue('minWon', null);

    if (!moneyLoss) setValue('lossAmount', null);
    if (!moneyLoss) setValue('maxLoss', null);
    if (!moneyLoss) setValue('minLoss', null);
    if (!countryCheck) setValue('countries', []);
  }, [
    kyc,
    countryCheck,
    ageGroup,
    genderCheck,
    loginCounter,
    referral,
    moneyDeposit,
    moneyWon,
    moneyLoss,
    setValue
  ]);

  useEffect(() => {
    console.log('called');
    if (segmentationUID) {
      fetchSegmentationDetails().then((result) => {
        if (result) {
          const mappedData = {
            name: result?.Name,

            // Gender
            genderCheck: result?.Filters?.GenderCheck === 'on',
            gender: result?.Filters?.Gender || null,
            // Age
            ageGroup: result?.Filters?.AgeCheck === 'on',
            minAge: Number(result?.Filters?.MinAge) >= 0 ? Number(result?.Filters?.MinAge) : null,
            maxAge: Number(result?.Filters?.MaxAge) >= 0 ? Number(result?.Filters?.MaxAge) : null,

            // KYC
            kyc: result?.Filters?.KYCCheck === 'on',
            kycType: result?.Filters?.KYC ? Number(result?.Filters?.KYC) : null,

            // Country
            countryCheck: result?.Filters?.CountryCheck === 'on',
            countries: (() => {
              const raw = result?.Filters?.Countries;
              if (!raw && raw !== 0) return [];
              if (Array.isArray(raw)) {
                return raw
                  .map((c) => (Number(c) >= 0 ? Number(c) : c))
                  .filter((v) => v !== null && v !== undefined && v !== '');
              }
              if (typeof raw === 'string') {
                return raw
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((c) => (Number(c) >= 0 ? Number(c) : c));
              }
              if (typeof raw === 'number') {
                return [raw];
              }
              return [];
            })(),

            // Login Counter
            loginCounter: result?.Filters?.LoginCounterCheck === 'on',
            minLoginCount:
              Number(result?.Filters?.MinLoginCount) >= 0
                ? Number(result?.Filters?.MinLoginCount)
                : null,
            maxLoginCount:
              Number(result?.Filters?.MaxLoginCount) >= 0
                ? Number(result?.Filters?.MaxLoginCount)
                : null,

            // Referral
            referral: result?.Filters?.RefCheck === 'on',
            minReferral:
              Number(result?.Filters?.RefMin) >= 0 ? Number(result?.Filters?.RefMin) : null,
            maxReferral:
              Number(result?.Filters?.RefMax) >= 0 ? Number(result?.Filters?.RefMax) : null,

            // Money Deposit
            moneyDeposit: result?.Filters?.MoneyDepositCheck === 'on',
            minDeposit:
              Number(result?.Filters?.MinMonDep) >= 0 ? Number(result?.Filters?.MinMonDep) : null,
            maxDeposit:
              Number(result?.Filters?.MaxMonDep) >= 0 ? Number(result?.Filters?.MaxMonDep) : null,

            // Money Won
            moneyWon: result?.Filters?.MoneyWonCheck === 'on',
            minWon:
              Number(result?.Filters?.MinMonWon) >= 0 ? Number(result?.Filters?.MinMonWon) : null,
            maxWon:
              Number(result?.Filters?.MaxMonWon) >= 0 ? Number(result?.Filters?.MaxMonWon) : null,

            // Money Loss
            moneyLoss: result?.Filters?.MoneyLossCheck === 'on',
            minLoss:
              Number(result?.Filters?.MinMonLoss) >= 0 ? Number(result?.Filters?.MinMonLoss) : null,
            maxLoss:
              Number(result?.Filters?.MaxMonLoss) >= 0 ? Number(result?.Filters?.MaxMonLoss) : null
          };

          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentationUID]);

  console.log('seg id: ', segmentationUID);

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
    setTimeout(() => {
      navigate('/segmentation');
    }, 0);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    await editSegmentationAPI({ segmentationUID, ...data });
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

              {
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={kycOptions}
                          value={
                            (kyc && kycOptions.find((opt) => opt.value === field.value)) || null
                          }
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          disabled={!kyc}
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
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('countries')} {...register('countryCheck')} />
              </div>

              {
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={countryOptions}
                          multiple
                          disabled={!countryCheck}
                          value={
                            Array.isArray(field.value)
                              ? countryOptions.filter((opt) => field.value.includes(opt.value))
                              : []
                          }
                          onChange={(vals) => field.onChange(vals.map((v) => v.value))}
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
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('age') + ' ' + t('group')} {...register('ageGroup')} />
              </div>
              {
                <>
                  <Input
                    {...register('minAge')}
                    error={errors?.minAge?.message}
                    placeholder={t('enter') + ' ' + t('minimum') + ' ' + t('age')}
                    type="number"
                    step="any"
                    disabled={!ageGroup}
                  />
                  <Input
                    {...register('maxAge')}
                    error={errors?.maxAge?.message}
                    placeholder={t('enter') + ' ' + t('maximum') + ' ' + t('age')}
                    type="number"
                    step="any"
                    disabled={!ageGroup}
                  />
                </>
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('gender')} {...register('genderCheck')} />
              </div>
              {
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={genderOptions}
                      disabled={!genderCheck}
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
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('login') + ' ' + t('counter')} {...register('loginCounter')} />
              </div>
              {
                <>
                  <Input
                    disabled={!loginCounter}
                    {...register('minLoginCount')}
                    error={errors?.minLoginCount?.message}
                    placeholder={t('minimum') + ' ' + t('login') + ' ' + t('count')}
                    type="number"
                    step="any"
                  />
                  <Input
                    disabled={!loginCounter}
                    {...register('maxLoginCount')}
                    error={errors?.maxLoginCount?.message}
                    placeholder={t('maximum') + ' ' + t('login') + ' ' + t('count')}
                    type="number"
                    step="any"
                  />
                </>
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('referral')} {...register('referral')} />
              </div>
              {
                <>
                  <Input
                    {...register('minReferral')}
                    error={errors?.minReferral?.message}
                    placeholder={t('minimum') + ' ' + t('referral') + ' ' + t('count')}
                    type="number"
                    step="any"
                    disabled={!referral}
                  />
                  <Input
                    disabled={!referral}
                    {...register('maxReferral')}
                    error={errors?.maxReferral?.message}
                    placeholder={t('maximum') + ' ' + t('referral') + ' ' + t('count')}
                    type="number"
                    step="any"
                  />
                </>
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('deposit')} {...register('moneyDeposit')} />
              </div>
              {
                <>
                  <Input
                    {...register('minDeposit')}
                    error={errors?.minDeposit?.message}
                    placeholder={t('minimum') + ' ' + t('deposit')}
                    type="number"
                    step="any"
                    prefix={moneyDeposit && symbol}
                    disabled={!moneyDeposit}
                  />
                  <Input
                    {...register('maxDeposit')}
                    error={errors?.maxDeposit?.message}
                    placeholder={t('maximum') + ' ' + t('deposit')}
                    type="number"
                    step="any"
                    prefix={moneyDeposit && symbol}
                    disabled={!moneyDeposit}
                  />
                </>
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('won')} {...register('moneyWon')} />
              </div>
              {
                <>
                  <Input
                    {...register('minWon')}
                    error={errors?.minWon?.message}
                    placeholder={t('minimum') + ' ' + t('won')}
                    type="number"
                    step="any"
                    disabled={!moneyWon}
                    prefix={moneyWon && symbol}
                  />
                  <Input
                    {...register('maxWon')}
                    error={errors?.maxWon?.message}
                    placeholder={t('maximum') + ' ' + t('won')}
                    type="number"
                    step="any"
                    disabled={!moneyWon}
                    prefix={moneyWon && symbol}
                  />
                </>
              }
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('money') + ' ' + t('loss')} {...register('moneyLoss')} />
              </div>
              {
                <>
                  <Input
                    disabled={!moneyLoss}
                    prefix={moneyLoss && symbol}
                    {...register('minLoss')}
                    error={errors?.minLoss?.message}
                    placeholder={t('minimum') + ' ' + t('loss')}
                    type="number"
                    step="any"
                  />
                  <Input
                    disabled={!moneyLoss}
                    prefix={moneyLoss && symbol}
                    {...register('maxLoss')}
                    error={errors?.maxLoss?.message}
                    placeholder={t('maximum') + ' ' + t('loss')}
                    type="number"
                    step="any"
                  />
                </>
              }
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
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

export default EditSegmentation;
