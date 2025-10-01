import AuthLayout from 'components/sections/auth/AuthLayout';
import LoginForm from 'components/sections/auth/LoginForm';
import AuthService from 'services/auth.services';
import { loginSchema } from 'components/sections/auth/schema';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { ADMIN_TYPE, LOCAL_STORAGE } from 'constants/app.constant';
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

  const loadPermissions = useCallback(async () => {
    await AuthService.loadAdminPermissions()
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

  const handleLoginSuccess = useCallback(
    async (response, inputData) => {
      if (!response.data?.mfaEnabled) {
        localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, response.data.AdminSessionToken);
        localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, response.data.adminData?.Email);
        const userData = response.data.adminData;
        const { appSettings, permissions } = await performPostLoginActions(userData?.AdminType);
        const response = {
          message: response.message,
          adminData: response.data.adminData,
          appSettings,
          permissions: permissions.permissions,
          isMasterAdmin: permissions.isMasterAdmin,
          adminType: userData?.adminType
        };

        localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, response?.adminData?.Email);
        localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(response.adminData));
        localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(response.appSettings));
        localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, response.isMasterAdmin);
        localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify(response.permissions));
        if (state?.path) {
          redirectTo = state?.path;
        }
        dispatch(AuthAction.login(response));
      }

      toast.success(response.message);
      const validateResponse = { ...response.data, userPassword: inputData.password };
      let isMfaEnabled = !!validateResponse?.mfaEnabled;
      let redirectTo =
        response.data.adminData?.adminType === ADMIN_TYPE.AGENT ? '/calling-agents/dashboard' : '/';

      if (isMfaEnabled) {
        redirectTo = `/otp-verification?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&UserToken=${validateResponse.AdminSessionToken}&&password=${validateResponse.userPassword}`;
      }

      await Promise.resolve((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
      navigate(redirectTo);
      return true;
    },
    [dispatch, navigate, performPostLoginActions, state?.path]
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
      />
    </AuthLayout>
  );
}
