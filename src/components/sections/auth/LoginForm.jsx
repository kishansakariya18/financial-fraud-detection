// Import Dependencies
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Local Imports
import { Button, Card, Checkbox, Input } from 'components/ui';
import { useDisclosure } from 'hooks';

// ----------------------------------------------------------------------

export default function LoginForm({
  authService,
  loginSchema,
  onLoginSuccess,
  forgotPasswordLink = '/forgot-password',
  signupLink = '/signup',
  title = 'Welcome Back',
  subtitle = 'Please sign in to continue'
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const navigate = useNavigate();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userData = useSelector((state) => state.auth.userData);

  const { t } = useTranslation();
  const [show, { toggle }] = useDisclosure();

  useEffect(() => {
    if (isLoggedIn) {
      const role = userData?.role;
      let r = role;
      if (!r) {
        try {
          r = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_DATA) || 'null')?.role;
        } catch {
          r = null;
        }
      }
      const defaultPath = String(r || '').toUpperCase() === 'ADMIN' ? '/admin' : '/dashboards/home';
      navigate(state?.path || defaultPath);
    }
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
            <Input
              label={t('email')}
              placeholder={t('enter') + ' ' + t('email')}
              prefix={<EnvelopeIcon className="size-4.5" />}
              {...register('email')}
              error={errors?.email?.message}
            />
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

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 dark:text-dark-300">
              {t('dont_have_account') || "Don't have an account?"}{' '}
              <a
                href={signupLink}
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                {t('signUp') || 'Sign Up'}
              </a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
