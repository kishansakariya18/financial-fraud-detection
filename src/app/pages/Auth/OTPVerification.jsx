// Import Dependencies
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// Local Imports
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
import { Button, Card, Input } from 'components/ui';
// import { useAuthContext } from "app/contexts/auth/context";
import { otpVerificationSchema } from './schema';
import { Page } from 'components/shared/Page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { getQueryParams } from 'utils/custom.utilities';
import AuthService from '../../../services/auth.services';
import { ADMIN_TYPE, LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from 'app/contexts/theme/context';

// ----------------------------------------------------------------------

export default function OTPVerification() {
  // const { login, errorMessage } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(otpVerificationSchema),
    defaultValues: {
      otp: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [searchParams, setSearchParams] = useSearchParams();
  const [seconds, setSeconds] = useState(30);
  const [resendOtp, setResendOtp] = useState('');
  const { isDark } = useThemeContext();

  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.otpVerification({
      ...data,
      token: queryParams.token,
      password: queryParams.password,
      mobile: queryParams.mobile
    });
    if (result) {
      if (result.status === 200) {
        localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, result.response.data.AdminSessionToken);
        localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, result.response.data?.adminData?.Email);
        const userData = result.response.data.adminData;
        const responseData = await performPostLoginActions(userData?.AdminType);
        setResponse({
          message: result.response.message,
          adminData: result.response.data.adminData,
          appSettings: responseData.appSettings,
          permissions: responseData.permissions.permissions,
          isMasterAdmin: responseData.permissions.isMasterAdmin
        });
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };

  const loadInitialVariables = async () => {
    const result = await AuthService.loadInitialSettings();
    const appSettingData = result.response.data || null;

    return appSettingData;
  };

  const loadPermissions = async () => {
    const result = await AuthService.loadAdminPermissions();
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
  };

  const performPostLoginActions = async (adminType) => {
    const appSettings = await loadInitialVariables();
    let permissions = [];
    if (adminType === ADMIN_TYPE.ADMIN) {
      permissions = await loadPermissions(adminType);
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
  };

  if (!isLoading && error) {
    setTimeout(() => {
      toast.error(error);
      setError('');
    }, 0);
  }
  // resend otp button handler
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await AuthService.resedOtp({
      token: queryParams.token,
      mobile: queryParams.mobile
    });

    if (result) {
      if (result.status === 200) {
        setSeconds(30);
        setSearchParams({ ...queryParams, token: result.response.data.token });
        setResendOtp(result.response);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };
  //resend otp timer
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  // save neccessary data  in local storage and redux
  useEffect(() => {
    if (!isLoading && !error && response) {
      toast.success(response.message);
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(response.adminData));
      localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(response.appSettings));
      localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, response.isMasterAdmin);
      localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify(response.permissions));
      dispatch(AuthAction.login(response));
      setTimeout(() => {
        setResponse('');
        navigate(state?.path || '/');
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  // resend otp display message
  useEffect(() => {
    if (resendOtp.message) {
      toast.success(resendOtp.message);
      setResendOtp('');
    }
  }, [resendOtp]);
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
              <p className="text-gray-400 dark:text-dark-300">{t('verify_otp_to_continue')}</p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label={t('enter') + ' OTP'}
                  placeholder={t('enter') + ' ' + 'OTP' + ' ' + t('here')}
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('otp')}
                  error={errors?.otp?.message}
                />
              </div>

              {seconds === 0 ? (
                <div className="mt-4 flex items-center justify-between space-x-2">
                  <a
                    href="##"
                    onClick={handleResendOtp}
                    className={`text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100 ${
                      isLoading ? 'pointer-events-none opacity-50' : ''
                    }`}>
                    {t('resend') + ' OTP?'}
                  </a>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between space-x-2">
                  {`Resend OTP In ${seconds} Seconds`}
                </div>
              )}

              <Button type="submit" className="mt-5 w-full" color="primary" disabled={isLoading}>
                {t('verify')} OTP
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}
