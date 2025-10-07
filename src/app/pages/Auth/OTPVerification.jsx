import AuthLayout from 'components/sections/auth/AuthLayout';
import OTPVerificationForm from 'components/sections/auth/OTPVerificationForm';
import AuthService from 'services/auth.services';
import { otpVerificationSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { ADMIN_TYPE, LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export default function OTPVerification() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadInitialVariables = useCallback(async () => {
    return AuthService.loadInitialSettings()
      .then((result) => {
        const appSettingData = result.response.data || null;
        return appSettingData;
      })
      .catch((error) => {
        console.error('Error while loading initial settings:', error);
        toast.error(error);
        return null;
      });
  }, []);

  const loadPermissions = useCallback(async () => {
    return AuthService.loadAdminPermissions()
      .then((result) => {
        const permissionData = result?.response?.data || {};

        const isMasterAdmin = permissionData?.IsSuperAdmin || 0;
        const permissions = permissionData?.permissions || [];

        const permissionList = permissions.map((permission) => {
          return permission.SlugName;
        });
        return {
          isMasterAdmin,
          permissions: permissionList
        };
      })
      .catch((error) => {
        console.error('Error while loading permissions:', error);
        toast.error(error);
        return {
          isMasterAdmin: 0,
          permissions: []
        };
      });
  }, []);

  const performPostLoginActions = useCallback(
    async (adminType) => {
      const appSettings = await loadInitialVariables();
      let permissions = [];
      if (adminType === ADMIN_TYPE.ADMIN) {
        permissions = await loadPermissions();
      } else {
        permissions = {
          isMasterAdmin: 0,
          permissions: []
        };
      }
      return {
        appSettings,
        permissions
      };
    },
    [loadInitialVariables, loadPermissions]
  );

  const handleVerificationSuccess = useCallback(
    async (responseData) => {
      localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, responseData.data.AdminSessionToken);
      localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, responseData.data?.adminData?.Email);
      const userData = responseData.data.adminData;
      const { appSettings, permissions } = await performPostLoginActions(userData?.AdminType);
      const response = {
        message: responseData.message,
        adminData: userData,
        appSettings,
        permissions: permissions.permissions,
        isMasterAdmin: permissions.isMasterAdmin
      };

      toast.success(response.message);
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(response.adminData));
      localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(response.appSettings));
      localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, response.isMasterAdmin);
      localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify(response.permissions));
      dispatch(AuthAction.login(response));

      let redirectTo = userData?.AdminType === ADMIN_TYPE.AGENT ? '/calling-agents/dashboard' : '/';

      setTimeout(() => {
        navigate(state?.path || redirectTo);
      }, 0);
    },
    [dispatch, navigate, performPostLoginActions, state?.path]
  );

  return (
    <AuthLayout title="OTP Verification">
      <OTPVerificationForm
        authService={AuthService}
        title={t('welcome_back')}
        onVerificationSuccess={handleVerificationSuccess}
        subtitle={t('verify_otp_to_continue')}
        otpVerificationSchema={otpVerificationSchema}
        successRedirect="/"
      />
    </AuthLayout>
  );
}
