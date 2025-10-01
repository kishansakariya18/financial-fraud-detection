import AuthLayout from 'components/sections/auth/AuthLayout';
import OTPVerificationForm from 'components/sections/auth/OTPVerificationForm';
import AgentAuthService from 'services/b2b-agent/agent-auth.services';
import { otpVerificationSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import AuthService from 'services/auth.services';
import { toast } from 'sonner';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { AuthAction } from 'store/admin-slice/AuthSlice';

// ----------------------------------------------------------------------

export default function AgentOTPVerification() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadInitialVariables = useCallback(async () => {
    return AuthService.loadInitialSettings()
      .then((result) => {
        return result.response.data || null;
      })
      .catch((error) => {
        console.error('Error while loading initial settings:', error);
        return null;
      });
  }, []);

  const handleVerificationSuccess = useCallback(
    async (responseData) => {
      localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, responseData.data.AgentSessionToken);
      localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, responseData.data?.agentData?.Email);
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

      toast.success(response.message);
      localStorage.setItem(LOCAL_STORAGE.IS_AGENT_USER, true);
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(appSettings));
      localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, false);
      localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify([]));
      dispatch(AuthAction.login(response));

      let redirectTo = `/agent/dashboard`;

      setTimeout(() => {
        navigate(state?.path || redirectTo);
      }, 0);
    },
    [dispatch, loadInitialVariables, navigate, state?.path]
  );

  return (
    <AuthLayout title="Agent OTP Verification">
      <OTPVerificationForm
        authService={AgentAuthService}
        otpVerificationSchema={otpVerificationSchema}
        title={t('welcome_back')}
        subtitle={t('verify_otp_to_continue')}
        successRedirect="/agent-dashboard"
        onVerificationSuccess={handleVerificationSuccess}
      />
    </AuthLayout>
  );
}
