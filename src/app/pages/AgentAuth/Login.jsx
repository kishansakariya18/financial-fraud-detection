import AuthLayout from 'components/sections/auth/AuthLayout';
import LoginForm from 'components/sections/auth/LoginForm';
import AgentAuthService from 'services/b2b-agent/agent-auth.services';
import { loginSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { toast } from 'sonner';
import { LOCAL_STORAGE } from 'constants/app.constant';
import AuthService from 'services/auth.services';

// ----------------------------------------------------------------------

export default function AgentLogin() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const loadInitialVariables = useCallback(async () => {
    await AuthService.loadInitialSettings()
      .then((result) => {
        return result.response.data;
      })
      .catch((error) => {
        console.error('Error while loading initial settings:', error);
        return null;
      });
  }, []);

  const handleLoginSuccess = useCallback(
    async (responseData, inputData) => {
      if (!responseData.data?.mfaEnabled) {
        localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, responseData.data.AgentSessionToken);
        const userData = responseData.data.agentData;
        const appSettings = await loadInitialVariables();
        const response = {
          message: responseData.message,
          agentData: userData,
          appSettings,
          permissions: [],
          isMasterAdmin: false,
          isAgentUser: true,
          agentType: userData?.AgentType
        };

        localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, userData?.Email);
        localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(appSettings));
        localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, false);
        localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify([]));
        if (state?.path) {
          redirectTo = state?.path;
        }
        dispatch(AuthAction.login(response));
      }

      toast.success(responseData.message);
      const validateResponse = { ...responseData.data, userPassword: inputData.password };
      let isMfaEnabled = !!validateResponse?.mfaEnabled;
      let redirectTo = '/agent/dashboard';

      if (isMfaEnabled) {
        redirectTo = `/agent-auth/otp-verification?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&UserToken=${validateResponse.AgentSessionToken}&&password=${validateResponse.userPassword}`;
      }

      await Promise.resolve((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
      navigate(redirectTo);
      return true;
    },
    [dispatch, loadInitialVariables, navigate, state?.path]
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/agent/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, state?.path]);

  return (
    <AuthLayout title="Agent Login">
      <LoginForm
        authService={AgentAuthService}
        loginSchema={loginSchema}
        onLoginSuccess={handleLoginSuccess}
        title={t('welcome_back')}
        subtitle={t('please_sign_in_to_continue')}
        forgotPasswordLink="/agent-auth/forgot-password"
      />
    </AuthLayout>
  );
}
