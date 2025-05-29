// Import Dependencies
import { useLocation, useNavigate } from 'react-router';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// Local Imports
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
import { Button, Card, Input } from 'components/ui';
import { forgotPasswordSchema } from './schema';
import { Page } from 'components/shared/Page';
import AuthService from 'services/auth.services';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from 'app/contexts/theme/context';

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [validateResponse, setValidateResponse] = useState(null);
  const [validateMessage, setValidateMessage] = useState(null);
  const { isDark } = useThemeContext();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      mobile: '',
      email: ''
    }
  });

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.valdiateResetPassword(data);
    if (result) {
      if (result.status === 200) {
        setValidateResponse(result.response.data);
        setValidateMessage(result.response.message);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!isLoading && !error && validateResponse && validateMessage) {
      toast.success(validateMessage);
      navigate(
        `/reset-password?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&email=${validateResponse.email}&&otp=${validateResponse.otp}`
      );
      setValidateResponse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateResponse]);

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
              <p className="text-gray-400 dark:text-dark-300">{t('confirm_to_reset')}</p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label={t('mobile')}
                  placeholder={t('enter') + ' ' + t('mobile')}
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('mobile')}
                  error={errors?.mobile?.message}
                />
                <Input
                  label={t('email')}
                  placeholder={t('enter') + ' ' + t('email')}
                  type="email"
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('email')}
                  error={errors?.email?.message}
                />
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <a
                  href="/login"
                  className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100">
                  {t('go_to_login')}
                </a>
              </div>

              <Button type="submit" className="mt-5 w-full" color="primary" disabled={isLoading}>
                {t('reset') + ' ' + t('password')}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}
