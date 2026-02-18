// Import Dependencies
import { LockClosedIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Local Imports
import { Button, Card, Input } from 'components/ui';
import { useDisclosure } from 'hooks';

// ----------------------------------------------------------------------

export default function SignupForm({
  authService,
  signupSchema,
  onSignupSuccess,
  loginLink = '/login',
  title = 'Create Account',
  subtitle = 'Sign up to get started'
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const navigate = useNavigate();
  const { state } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { t } = useTranslation();
  const [showPassword, { toggle: togglePassword }] = useDisclosure();
  const [showConfirmPassword, { toggle: toggleConfirmPassword }] = useDisclosure();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (data) => {
    await authService
      .signup(data)
      .then(async (result) => {
        await onSignupSuccess?.(result.response, data);
      })
      .catch((error) => {
        console.error('Error while signup:', error);
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
              label={t('name')}
              placeholder={t('enter') + ' ' + t('name')}
              prefix={<UserIcon className="size-4.5" />}
              {...register('name')}
              error={errors?.name?.message}
            />
            <Input
              label={t('email')}
              placeholder={t('enter') + ' ' + t('email')}
              prefix={<EnvelopeIcon className="size-4.5" />}
              {...register('email')}
              error={errors?.email?.message}
            />
            <Input
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('enter') + ' ' + t('password')}
              prefix={<LockClosedIcon className="size-4.5" />}
              suffix={
                <Button
                  variant="flat"
                  className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                  onClick={togglePassword}>
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
              label={t('confirmPassword') || 'Confirm Password'}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('enter') + ' ' + (t('confirmPassword') || 'Confirm Password')}
              prefix={<LockClosedIcon className="size-4.5" />}
              suffix={
                <Button
                  variant="flat"
                  className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
                  onClick={toggleConfirmPassword}>
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

          <Button type="submit" className="mt-5 w-full" color="primary" disabled={isSubmitting}>
            {t('signUp') || 'Sign Up'}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 dark:text-dark-300">
              {t('already_have_account') || 'Already have an account?'}{' '}
              <a
                href={loginLink}
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                {t('signIn')}
              </a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
