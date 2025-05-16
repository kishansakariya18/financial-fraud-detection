// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Checkbox, Input } from 'components/ui';
import { CiMobile1 } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import AffiliateService from 'services/affiliate.services';
import {
  affiliateStatusOptions,
  affiliateStatusToApp,
  depositCommissionTypeOptions,
  playerLossCommissionTypeOptions
} from './helper';
import { BiMoney } from 'react-icons/bi';
import { LuScanText } from 'react-icons/lu';
import { editAffiliateSchema } from './schema';

const EditAffiliate = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const { affiliateId } = useParams();
  const breadcrumbItem = [{ title: t('affiliates'), path: '/affiliate' }, { title: t('edit') }];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm({
    resolver: yupResolver(editAffiliateSchema)
  });

  const perSignup = watch('perSignup');
  const perDeposit = watch('perDeposit');
  const perPlayerLoss = watch('perPlayerLoss');

  const fetchAffiliateDetails = async () => {
    const result = await AffiliateService.getAffiliateDetail(affiliateId);

    if (result.status === 200) {
      return result.response.data;
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    if (affiliateId) {
      fetchAffiliateDetails().then((result) => {
        if (result) {
          const mappedData = {
            userName: result.Username,
            firstName: result.FirstName,
            lastName: result.LastName,
            email: result.Email,
            mobile: result.Mobile,
            referralCode: result.ReferralCode,
            status: affiliateStatusToApp(result.AccountStatus),
            password: '', // leave empty for security
            confirmPassword: '',
            perSignup: result.IsSignupCommissionEnabled,
            signupCommission: result.SignupCommissionAmount,
            signupCommissionType: result.SignupCommissionType,
            perDeposit: result.IsDepositCommissionEnabled,
            depositCommission: result.DepositCommissionAmount,
            depositCommissionType: result.DepositCommissionType,
            perPlayerLoss: result.IsUserLossCommissionEnabled,
            playerLossCommission: result.UserLossCommissionAmount,
            playerLossCommissionType: result.UserLossCommissionType
          };

          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateId]);

  const editAffiliateAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AffiliateService.editAffiliate(requestObject);
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
    fetchAffiliateDetails();

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await editAffiliateAPI({ affiliateUID: affiliateId, ...data });
  };
  return (
    <Page title={t('edit') + ' ' + t('affiliate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('affiliate') + ' ' + t('form')}
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
                {...register('userName')}
                prefix={<UserIcon className="size-5" />}
                label={t('userName')}
                error={errors?.userName?.message}
                placeholder={t('enter') + ' ' + t('userName')}
              />
              <Input
                {...register('firstName')}
                prefix={<UserIcon className="size-5" />}
                label={t('firstName')}
                error={errors?.firstName?.message}
                placeholder={t('enter') + ' ' + t('firstName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('lastName')}
                prefix={<UserIcon className="size-5" />}
                label={t('lastName')}
                error={errors?.lastName?.message}
                placeholder={t('enter') + ' ' + t('lastName')}
              />
              <Input
                {...register('email')}
                prefix={<EnvelopeIcon className="size-5" />}
                label={t('enter') + ' ' + t('email')}
                error={errors?.email?.message}
                placeholder={t('enter') + ' ' + t('email') + ' ' + t('address')}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={affiliateStatusOptions}
                    value={
                      affiliateStatusOptions.find((status) => status.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('status')}
                    placeholder={t('select') + ' ' + t('status')}
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
              />

              <Input
                {...register('mobile')}
                prefix={<CiMobile1 className="size-5" />}
                label={t('enter') + ' ' + t('mobile')}
                error={errors?.mobile?.message}
                placeholder={t('enter') + ' ' + t('mobile') + ' ' + t('number')}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                {...register('referralCode')}
                prefix={<LuScanText className="size-5" />}
                label={t('enter') + ' ' + t('referralCode')}
                error={errors?.referralCode?.message}
                placeholder={t('enter') + ' ' + t('referralCode')}
              />
            </div>
          </div>
          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('commission') + ' ' + t('setting')}
          </h6>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('per') + ' ' + t('signup')} {...register('perSignup')} />
              </div>

              {perSignup && (
                <div>
                  <Input
                    {...register('signupCommission')}
                    prefix={<BiMoney className="size-5" />}
                    error={errors?.signupCommission?.message}
                    placeholder={t('enter') + ' ' + t('signup') + ' ' + t('commission')}
                    type="number"
                  />
                </div>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('per') + ' ' + t('deposit')} {...register('perDeposit')} />
              </div>

              {perDeposit && (
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={depositCommissionTypeOptions}
                          value={
                            depositCommissionTypeOptions.find((opt) => opt.value === field.value) ||
                            null
                          }
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          placeholder={
                            t('select') +
                            ' ' +
                            t('deposit') +
                            ' ' +
                            t('commission') +
                            ' ' +
                            t('type')
                          }
                          displayField="label"
                          error={errors?.depositCommissionType?.message}
                        />
                      )}
                      control={control}
                      name="depositCommissionType"
                    />
                  </div>
                  <div>
                    <Input
                      {...register('depositCommission')}
                      prefix={<BiMoney className="size-5" />}
                      error={errors?.depositCommission?.message}
                      placeholder={t('enter') + ' ' + t('deposit') + ' ' + t('commission')}
                      type="number"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Checkbox label={t('per') + ' ' + t('playerLoss')} {...register('perPlayerLoss')} />
              </div>

              {perPlayerLoss && (
                <>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={playerLossCommissionTypeOptions}
                          value={
                            playerLossCommissionTypeOptions.find(
                              (opt) => opt.value === field.value
                            ) || null
                          }
                          onChange={(val) => field.onChange(val.value)}
                          name={field.name}
                          placeholder={
                            t('select') +
                            ' ' +
                            t('playerLoss') +
                            ' ' +
                            t('commission') +
                            ' ' +
                            t('type')
                          }
                          displayField="label"
                          error={errors?.playerLossCommissionType?.message}
                        />
                      )}
                      control={control}
                      name="playerLossCommissionType"
                    />
                  </div>
                  <div>
                    <Input
                      {...register('playerLossCommission')}
                      prefix={<BiMoney className="size-5" />}
                      error={errors?.playerLossCommission?.message}
                      placeholder={t('enter') + ' ' + t('playerLoss') + ' ' + t('comission')}
                      type="number"
                    />
                  </div>
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

export default EditAffiliate;
