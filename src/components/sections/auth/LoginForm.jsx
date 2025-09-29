// Import Dependencies
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { CiMobile1 } from 'react-icons/ci';

// Local Imports
import { Button, Card, Checkbox, Input } from 'components/ui';
import { useDisclosure } from 'hooks';
import AdminService from 'services/admin.services';

// ----------------------------------------------------------------------

export default function LoginForm({
  authService,
  loginSchema,
  onLoginSuccess,
  forgotPasswordLink = '/forgot-password',
  title = 'Welcome Back',
  subtitle = 'Please sign in to continue'
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: '',
      phoneCode: '+1'
    }
  });

  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { t } = useTranslation();
  const [show, { toggle }] = useDisclosure();

  const fetchCountryList = async () => {
    try {
      const result = await AdminService.fetchCountryList();
      if (result.status === 200 || result.status === 201) {
        setCountries(result.response.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    fetchCountryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (data) => {
    await authService
      .login(data)
      .then(async (result) => {
        await onLoginSuccess?.(result.response, data);
      })
      .catch((error) => {
        console.error('Error while login:', error);
        toast.error(error);
      });
  };

  return (
    <div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">{title}</h2>
        <p className="text-gray-400 dark:text-dark-300">{subtitle}</p>
      </div>
      <Card className="mt-5 rounded-lg p-5 lg:p-7">
        <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-dark-100">
                {t('mobile')}
              </label>
              <div className="relative flex rounded-lg border border-gray-300 bg-white shadow-sm transition-colors duration-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 hover:border-gray-400 dark:border-dark-500 dark:bg-dark-700 dark:focus-within:border-primary-500 dark:hover:border-dark-400">
                <div className="flex items-center pl-3">
                  <CiMobile1 className="size-5 text-gray-400 dark:text-dark-300" strokeWidth="1" />
                  <Controller
                    render={({ field }) => (
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 border-none bg-transparent pr-1 text-sm font-medium text-gray-700 outline-none dark:text-dark-100">
                        {countries.map((country, index) => (
                          <option
                            key={country.PhoneCode + 'index-' + index}
                            value={country.PhoneCode}>
                            {country.PhoneCode}
                          </option>
                        ))}
                      </select>
                    )}
                    control={control}
                    name="phoneCode"
                  />
                  <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <input
                  type="tel"
                  placeholder={t('enter') + ' ' + t('mobile')}
                  className="flex-1 border-none bg-transparent px-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-dark-100 dark:placeholder-dark-300"
                  {...register('mobile')}
                />
              </div>
              {(errors?.mobile?.message || errors?.phoneCode?.message) && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors?.mobile?.message || errors?.phoneCode?.message}
                </p>
              )}
            </div>
            <Input
              label={t('password')}
              type={show ? 'text' : 'password'}
              placeholder={t('enter') + ' ' + t('password')}
              prefix={<LockClosedIcon className="size-4.5" />}
              suffix={
                <Button
                  variant="flat"
                  className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                  onClick={toggle}>
                  {show ? (
                    <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  ) : (
                    <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  )}
                </Button>
              }
              {...register('password')}
              error={errors?.password?.message}
            />
          </div>

          <div className="mt-4 flex items-center justify-between space-x-2">
            <Checkbox label="Remember me" />
            <a
              href={forgotPasswordLink}
              className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100">
              {t('forgot') + ' ' + t('password')} ?
            </a>
          </div>

          <Button type="submit" className="mt-5 w-full" color="primary" disabled={isSubmitting}>
            {t('signIn')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
