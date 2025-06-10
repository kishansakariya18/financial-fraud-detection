// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import AdminService from 'services/admin.services';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';

const ReferralManagement = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [{ title: t('admin'), path: '/admin' }, { title: t('create') }];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver()
  });

  const referralManagement = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AdminService.createAdmin(requestObject);
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
      navigate('/users/admin');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await referralManagement(data);
  };
  return (
    <Page title={t('referral') + ' ' + t('management')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('referral') + ' ' + t('management')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('with_key') + ' ' + t('referral')}
          </h6>
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
              <Input
                {...register('password')}
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                label={t('enter') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('password')}
              />
            </div>
          </div>

          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('without') + ' ' + t('referral')}
          </h6>

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
              <Input
                {...register('password')}
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                label={t('enter') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('password')}
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

export default ReferralManagement;
