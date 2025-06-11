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

// Assuming you have a Yup schema for validation
// For demonstration, I'm providing a basic schema structure.
// You should define your actual validation rules here.
import * as yup from 'yup';

const schema = yup.object().shape({
  // Referral By fields
  referredBySignupBonus: yup.number().typeError('Must be a number').nullable(),
  referredByBonus: yup.number().typeError('Must be a number').nullable(),

  // Referral To fields
  referredToSignupBonus: yup.number().typeError('Must be a number').nullable(),
  referredToBonus: yup.number().typeError('Must be a number').nullable(),

  // General user details (if still needed, or integrate them into "Referral To" user details)
  userName: yup.string().nullable(),
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  email: yup.string().email('Invalid email').nullable(),
  password: yup.string().nullable()
});

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
    resolver: yupResolver(schema) // Apply the yup schema here
  });

  const referralManagement = async (requestObject) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming AdminService.createAdmin handles the referral management logic
      // You might need a specific service method for referral management
      const result = await AdminService.createAdmin(requestObject);
      if (result && (result.status === 200 || result.status === 201)) {
        setResponse(result.response);
      } else {
        setError(result.error || t('something_went_wrong')); // Fallback error message
      }
    } catch (err) {
      setError(t('an_unexpected_error_occurred'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/users/admin'); // Navigate after successful operation
    }, 0);
    setResponse(null);
  }

  const onSubmit = async (data) => {
    // You might need to transform the data here to match your API's expected format
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
          {/* Referral By Section */}
          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('referral') + ' ' + t('settings')}
          </h6>
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Referral By Column */}
              <div>
                <h6 className="mb-4 pb-2 text-base font-semibold text-gray-700 dark:text-dark-200">
                  {t('referred') + ' ' + t('by')}
                </h6>
                <div className="space-y-4">
                  <Input
                    {...register('referredBySignupBonus')}
                    label={t('realCash')}
                    error={errors?.referredBySignupBonus?.message}
                    placeholder={t('signup') + ' ' + t('bonus')}
                    type="number" // Ensure numerical input
                    className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
                  />
                  <Input
                    {...register('referredByBonus')}
                    label={t('bonus')}
                    error={errors?.referredByBonus?.message}
                    placeholder={t('bonus')}
                    type="number" // Ensure numerical input
                    className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
                  />
                </div>
              </div>

              {/* Referral To Column */}
              <div>
                <h6 className="mb-4 pb-2 text-base font-semibold text-gray-700 dark:text-dark-200">
                  {t('referred') + ' ' + t('to')}
                </h6>
                <div className="space-y-4">
                  <Input
                    {...register('referredToSignupBonus')}
                    label={t('realCash')}
                    error={errors?.referredToSignupBonus?.message}
                    placeholder={t('signup') + ' ' + t('bonus')}
                    type="number"
                    className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
                  />
                  <Input
                    {...register('referredToBonus')}
                    label={t('bonus')}
                    error={errors?.referredToBonus?.message}
                    placeholder={t('bonus')}
                    type="number"
                    className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Details Section (General or for 'Referral To' user if applicable) */}
          <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('user') + ' ' + t('details')} {/* Changed from 'without referral' for clarity */}
          </h6>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('userName')}
                prefix={<UserIcon className="size-5 text-gray-400 dark:text-gray-300" />}
                label={t('userName')}
                error={errors?.userName?.message}
                placeholder={t('enter') + ' ' + t('userName')}
                className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
              />
              <Input
                {...register('firstName')}
                prefix={<UserIcon className="size-5 text-gray-400 dark:text-gray-300" />}
                label={t('firstName')}
                error={errors?.firstName?.message}
                placeholder={t('enter') + ' ' + t('firstName')}
                className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('lastName')}
                prefix={<UserIcon className="size-5 text-gray-400 dark:text-gray-300" />}
                label={t('lastName')}
                error={errors?.lastName?.message}
                placeholder={t('enter') + ' ' + t('lastName')}
                className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
              />
              <Input
                {...register('email')}
                prefix={<EnvelopeIcon className="size-5 text-gray-400 dark:text-gray-300" />}
                label={t('enter') + ' ' + t('email')}
                error={errors?.email?.message}
                placeholder={t('enter') + ' ' + t('email') + ' ' + t('address')}
                className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                {...register('password')}
                prefix={
                  <LockClosedIcon
                    className="size-5 text-gray-400 transition-colors duration-200 dark:text-gray-300"
                    strokeWidth="1"
                  />
                }
                label={t('enter') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('password')}
                type="password" // Added type for password field
                className="border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-500"
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
