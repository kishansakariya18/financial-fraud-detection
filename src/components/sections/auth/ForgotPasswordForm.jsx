import { useLocation, useNavigate } from 'react-router';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button, Card, Input, InputErrorMsg } from 'components/ui';
import { PhoneDialCode } from 'components/custom/PhoneDialCode';
import AdminService from 'services/admin.services';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm({
  authService,
  title = 'Welcome Back',
  subtitle = 'Confirm details to reset password',
  forgotPasswordSchema,
  onForgotPasswordSuccess,
  loginLink = '/login',
  resetPasswordRoute = '/reset-password',
  successRedirect = '/'
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [countries, setCountries] = useState([]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || successRedirect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      mobile: '',
      email: '',
      phoneCode: '+1'
    }
  });

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
    fetchCountryList();
  }, []);

  const submitHandler = async (data) => {
    await authService
      .valdiateResetPassword(data)
      .then((result) => {
        const validateResponse = result.response.data;
        toast.success(result.response.message);

        const redirectUrl = `${resetPasswordRoute}?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&email=${validateResponse.email}&&otp=${validateResponse.otp}&phoneCode=${encodeURIComponent(validateResponse.phoneCode)}`;

        if (onForgotPasswordSuccess) {
          onForgotPasswordSuccess(validateResponse, redirectUrl);
        } else {
          navigate(redirectUrl);
        }
      })
      .catch((error) => {
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
              label={t('email')}
              placeholder={t('enter') + ' ' + t('email')}
              type="email"
              prefix={
                <EnvelopeIcon className="size-5 transition-colors duration-200" strokeWidth="1" />
              }
              {...register('email')}
              error={errors?.email?.message}
            />
          </div>

          <div className="mt-4 flex items-center justify-between space-x-2">
            <a
              href={loginLink}
              className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100">
              {t('go_to_login')}
            </a>
          </div>

          <Button type="submit" className="mt-5 w-full" color="primary" disabled={isSubmitting}>
            {t('reset') + ' ' + t('password')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
