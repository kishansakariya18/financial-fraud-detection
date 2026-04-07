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
import { getPostLoginPath } from 'utils/postLoginRedirect';

// ----------------------------------------------------------------------

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const isLoggedIn = useSelector((s) => s.auth?.isLoggedIn);

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
          isMasterAdmin: String(user.role || '').toUpperCase() === 'ADMIN' ? 1 : 0
        })
      );

      toast.success('Login successful');
      const target = getPostLoginPath(user, state);
      navigate(target, { replace: true });
      return true;
    },
    [dispatch, navigate, state]
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_DATA) || 'null');
    } catch {
      storedUser = null;
    }
    const target = getPostLoginPath(storedUser, state);
    navigate(target, { replace: true });
  }, [isLoggedIn, navigate, state]);

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
