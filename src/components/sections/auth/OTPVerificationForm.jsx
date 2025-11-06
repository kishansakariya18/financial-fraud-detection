import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button, Card, Input } from 'components/ui';
import { getQueryParams } from 'utils/custom.utilities';

// ----------------------------------------------------------------------

export default function OTPVerificationForm({
  authService,
  otpVerificationSchema,
  onVerificationSuccess,
  title = 'Welcome Back',
  subtitle = 'Enter OTP to continue',
  successRedirect = '/'
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(otpVerificationSchema),
    defaultValues: {
      otp: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [searchParams, setSearchParams] = useSearchParams();
  const [seconds, setSeconds] = useState(30);

  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || successRedirect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const submitHandler = async (data) => {
    await authService
      .otpVerification({
        ...data,
        phoneCode: queryParams.phoneCode,
        token: queryParams.token,
        password: queryParams.password,
        mobile: queryParams.mobile
      })
      .then(async (result) => {
        await onVerificationSuccess(result.response);
      })
      .catch((error) => {
        console.error('Error while OTP verification:', error);
        toast.error(error);
      });
  };
  // resend otp button handler
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await authService
      .resedOtp({
        token: queryParams.token,
        mobile: queryParams.mobile,
        phoneCode: queryParams.phoneCode
      })
      .then((result) => {
        setSeconds(30);
        setSearchParams({ ...queryParams, token: result.response.data.token });
        toast.success(result.response.message);
      })
      .catch((error) => {
        console.error('Error while resending OTP:', error);
        toast.error(error.message || error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //resend otp timer
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
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
              label={t('enter') + ' OTP'}
              placeholder={t('enter') + ' ' + 'OTP' + ' ' + t('here')}
              prefix={
                <EnvelopeIcon className="size-5 transition-colors duration-200" strokeWidth="1" />
              }
              {...register('otp')}
              error={errors?.otp?.message}
            />
          </div>

          {seconds === 0 ? (
            <div className="mt-4 flex items-center justify-between space-x-2">
              <a
                href="##"
                onClick={handleResendOtp}
                className={`text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100 ${
                  isLoading || isSubmitting ? 'pointer-events-none opacity-50' : ''
                }`}>
                {t('resend') + ' OTP?'}
              </a>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between space-x-2">
              {`Resend OTP In ${seconds} Seconds`}
            </div>
          )}

          <Button
            type="submit"
            className="mt-5 w-full"
            color="primary"
            disabled={isLoading || isSubmitting}>
            {t('verify')} OTP
          </Button>
        </form>
      </Card>
    </div>
  );
}
