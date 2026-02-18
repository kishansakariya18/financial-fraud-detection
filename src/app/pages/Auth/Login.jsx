import AuthLayout from 'components/sections/auth/AuthLayout';
import LoginForm from 'components/sections/auth/LoginForm';
import AuthService from 'services/auth.services';
import { loginSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function Login() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const handleLoginSuccess = useCallback(
    async (apiResponse) => {
      const { user, token } = apiResponse;

      localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, user.email);
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(user));

      dispatch(
        AuthAction.login({
          userData: user,
          permissions: [],
          isMasterAdmin: user.role === 'ADMIN' ? 1 : 0
        })
      );

      toast.success('Login successful');
      navigate(state?.path || '/');
      return true;
    },
    [dispatch, navigate, state?.path]
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, state?.path]);

  return (
    <AuthLayout title="Login">
      <LoginForm
        authService={AuthService}
        loginSchema={loginSchema}
        title={t('welcome_back')}
        onLoginSuccess={handleLoginSuccess}
        subtitle={t('please_sign_in_to_continue')}
        forgotPasswordLink="/forgot-password"
        signupLink="/signup"
      />
    </AuthLayout>
  );
}
