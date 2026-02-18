import AuthLayout from 'components/sections/auth/AuthLayout';
import SignupForm from 'components/sections/auth/SignupForm';
import AuthService from 'services/auth.services';
import { signupSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function Signup() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const handleSignupSuccess = useCallback(
    async (response) => {
      toast.success(response.message || 'Account created successfully');
      navigate('/login');
    },
    [navigate]
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, state?.path]);

  return (
    <AuthLayout title="Sign Up">
      <SignupForm
        authService={AuthService}
        signupSchema={signupSchema}
        title={t('create_account') || 'Create Account'}
        onSignupSuccess={handleSignupSuccess}
        subtitle={t('sign_up_to_get_started') || 'Sign up to get started'}
        loginLink="/login"
      />
    </AuthLayout>
  );
}
