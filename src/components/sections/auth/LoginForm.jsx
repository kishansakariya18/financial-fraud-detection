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
// import { CiMobile1 } from 'react-icons/ci';

// Local Imports
import { Button, Card, Checkbox, Input, InputErrorMsg } from 'components/ui';
import { useDisclosure } from 'hooks';
import AdminService from 'services/admin.services';
import { PhoneDialCode } from 'components/custom/PhoneDialCode';

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
        const countries = result.response.data.map((c) => {
          return {
            phoneCode: c.PhoneCode,
            name: c.CountryName,
            code: c.CountryCode
          };
        });
        setCountries(countries);
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
            <div className="flex flex-col">
              <span>{t('mobile')}</span>
              <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                <Controller
                  render={({ field: { onChange, value, name } }) => (
                    <PhoneDialCode
                      onChange={onChange}
                      value={value}
                      name={name}
                      error={Boolean(errors?.phoneCode)}
                      countries={countries}
                    />
                  )}
                  control={control}
                  name="phoneCode"
                />
                <Input
                  {...register('mobile')}
                  classNames={{
                    root: 'flex-1',
                    input: 'hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none'
                  }}
                  error={Boolean(errors?.mobile)}
                  placeholder={t('enter') + ' ' + t('mobile')}
                />
              </div>
              <InputErrorMsg when={errors?.phoneCode || errors?.mobile}>
                {errors?.phoneCode?.message ?? errors?.mobile?.message}
              </InputErrorMsg>
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
