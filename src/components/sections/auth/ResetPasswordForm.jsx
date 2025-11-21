import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button, Card, Input } from 'components/ui';
import { getQueryParams } from 'utils/custom.utilities';
import { RESEND_OTP_TYPE } from 'constants/app.constant';

// ----------------------------------------------------------------------

export default function ResetPasswordForm({
  authService,
  resetPasswordSchema,
  onResetPasswordSuccess,
  title = 'Welcome Back',
  subtitle = 'Reset your password to continue',
  loginRoute = '/login',
  successRedirect = '/'
}) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [searchParams, setSearchParams] = useSearchParams();
  const [seconds, setSeconds] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || successRedirect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const submitHandler = async (data) => {
    setIsLoading(true);
    await authService
      .resetPassword({
        ...data,
        token: queryParams.token,
        email: queryParams.email,
        mobile: queryParams.mobile,
        phoneCode: queryParams.phoneCode
      })
      .then((result) => {
        toast.success(result.response.message);
        if (onResetPasswordSuccess) {
          onResetPasswordSuccess(result.response, loginRoute);
        } else {
          navigate(loginRoute);
        }
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setError(null);
  };

  if (!isLoading && error) {
    setTimeout(() => {
      toast.error(error);
      setError(null);
    }, 0);
  }

  // resend otp button handler
  const handleResendOtp = async (e) => {
    e.preventDefault();
    resetField('otp');
    setIsLoading(true);
    await authService
      .resedOtp({
        token: queryParams.token,
        mobile: queryParams.mobile,
        phoneCode: queryParams.phoneCode,
        type: RESEND_OTP_TYPE.RESET_PASSWORD
      })
      .then((result) => {
        setSearchParams({ ...queryParams, token: result.response.data.token });
        toast.success(result.response.message);
        setSeconds(30);
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //resend otp timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((second) => second - 1);
      }

      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">{title}</h2>
        <p className="text-gray-400 dark:text-dark-300">{subtitle}</p>
      </div>
      <Card className="mt-5 rounded-lg p-5 lg:p-7">
        <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
          <div className="space-y-4">
            <Input
              label="OTP"
              placeholder={t('enter') + ' ' + t('otp')}
              prefix={
                <EnvelopeIcon className="size-5 transition-colors duration-200" strokeWidth="1" />
              }
              {...register('otp')}
              error={errors?.otp?.message}
            />
            <Input
              label={t('new_key') + ' ' + t('password')}
              placeholder={t('enter') + ' ' + t('new_key') + ' ' + t('password')}
              type={showPassword ? 'text' : 'password'}
              prefix={
                <LockClosedIcon className="size-5 transition-colors duration-200" strokeWidth="1" />
              }
              suffix={
                <Button
                  variant="flat"
                  className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}>
                  {showPassword ? (
                    <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  ) : (
                    <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  )}
                </Button>
              }
              {...register('password')}
              error={errors?.password?.message}
            />
            <Input
              label={t('confirm') + ' ' + t('password')}
              placeholder={t('enter') + ' ' + t('confirm') + ' ' + t('password')}
              type={showConfirmPassword ? 'text' : 'password'}
              prefix={
                <LockClosedIcon className="size-5 transition-colors duration-200" strokeWidth="1" />
              }
              suffix={
                <Button
                  variant="flat"
                  className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}>
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  ) : (
                    <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
                  )}
                </Button>
              }
              {...register('confirmPassword')}
              error={errors?.confirmPassword?.message}
            />
          </div>

          {seconds === 0 ? (
            <div className="mt-4 flex items-center justify-between space-x-2">
              <a
                href="##"
                onClick={handleResendOtp}
                className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100">
                {t('resend') + ' ' + t('otp') + '?'}
              </a>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between space-x-2">
              {`${t('resend') + ' ' + t('otp')} In ${seconds} Seconds`}
            </div>
          )}

          <Button type="submit" className="mt-5 w-full" color="primary" disabled={isLoading}>
            {t('verify') + ' ' + t('otp')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
