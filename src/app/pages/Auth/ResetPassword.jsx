// Import Dependencies
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// Local Imports
import { Button, Card, Input } from 'components/ui';
import { resetPasswordSchema } from './schema';
import { Page } from 'components/shared/Page';
import AuthService from 'services/auth.services';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from 'app/contexts/theme/context';
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';

export default function ResetPassword() {
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

  const { isDark } = useThemeContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [searchParams, setSearchParams] = useSearchParams();
  const [seconds, setSeconds] = useState(30);
  const [resendOtp, setResendOtp] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.resetPassword({
      ...data,
      token: queryParams.token,
      email: queryParams.email,
      mobile: queryParams.mobile
    });
    if (result) {
      if (result.status === 200) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
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
    const result = await AuthService.resedOtp({
      token: queryParams.token,
      mobile: queryParams.mobile
    });

    if (result) {
      if (result.status === 200) {
        setSearchParams({ ...queryParams, token: result.response.data.token });
        setResendOtp(result.response);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
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

  useEffect(() => {
    if (!isLoading && !error && response) {
      console.log('toast called');

      toast.success(response.message);
      navigate('/login');
      setResponse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  // resend otp display message
  useEffect(() => {
    if (resendOtp.message) {
      toast.success(resendOtp.message);
    }

    setResendOtp('');
  }, [resendOtp]);

  return (
    <Page title="Login">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            {isDark ? <DarkThemeLogo /> : <LightThemeLogo />}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                {t('welcome_back')}
              </h2>
              <p className="text-gray-400 dark:text-dark-300">{t('reset_to_continue')}</p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="OTP"
                  placeholder={t('enter') + ' ' + t('otp')}
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('otp')}
                  error={errors?.otp?.message}
                />
                <Input
                  label={t('new_key') + ' ' + t('password')}
                  placeholder={t('enter') + ' ' + t('new_key') + ' ' + t('password')}
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('password')}
                  error={errors?.password?.message}
                />
                <Input
                  label={t('confirm') + ' ' + t('password')}
                  placeholder={t('enter') + ' ' + t('confirm') + ' ' + t('password')}
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
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
      </main>
    </Page>
  );
}
