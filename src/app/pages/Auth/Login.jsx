// Import Dependencies
import { useLocation, useNavigate } from 'react-router';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

// Local Imports
import LightThemeLogo from 'assets/appLogo_light_theme.svg?react';
import DarkThemeLogo from 'assets/appLogo_dark_theme.svg?react';
import { Button, Card, Checkbox, Input } from 'components/ui';
import { loginSchema } from './schema';
import { Page } from 'components/shared/Page';
import AuthService from 'services/auth.services';
import AdminService from 'services/admin.services';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { ADMIN_TYPE, LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from 'app/contexts/theme/context';
import { useDisclosure } from 'hooks';
import { CiMobile1 } from 'react-icons/ci';

// ----------------------------------------------------------------------

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: '',
      phoneCode: '+1'
    }
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [validateResponse, setValidateResponse] = useState(null);
  const [validateMessage, setValidateMessage] = useState(null);
  const { isDark } = useThemeContext();

  const { t } = useTranslation();
  const [show, { toggle }] = useDisclosure();

  const fetchCountryList = async () => {
    const result = await AdminService.fetchCountryList();
    if (result.status === 200 || result.status === 201) {
      setCountries(result.response.data);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    fetchCountryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.login(data);
    if (result) {
      if (result.status === 200) {
        if (!result.response.data?.mfaEnabled) {
          localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, result.response.data.AdminSessionToken);
          const userData = result.response.data.adminData;
          const responseData = await performPostLoginActions(userData?.adminType);
          setResponse({
            message: result.response.message,
            adminData: result.response.data.adminData,
            appSettings: responseData?.appSettings,
            permissions: responseData?.permissions?.permissions,
            isMasterAdmin: responseData?.permissions?.isMasterAdmin,
            adminType: userData?.adminType
          });
        }
        setValidateResponse({ ...result.response.data, userPassword: data.password });
        setValidateMessage(result.response.message);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };

  if (!isLoading && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    if (!isLoading && !error && validateResponse) {
      toast.success(validateMessage);

      let isMfaEnabled = validateResponse?.mfaEnabled ? true : false;
      let redirectTo = '/';
      if (isMfaEnabled) {
        // localStorage.setItem(LOCAL_STORAGE.AUTH_PASSWORD, validateResponse.userPassword);
        // localStorage.setItem(LOCAL_STORAGE.TWO_STEP_MODE, 'login');
        redirectTo = `/otp-verification?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&UserToken=${validateResponse.AdminSessionToken}&&password=${validateResponse.userPassword}`;
      } else {
        localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, response?.adminData?.Email);
        localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(response.adminData));
        localStorage.setItem(LOCAL_STORAGE.SETTINGS, JSON.stringify(response.appSettings));
        localStorage.setItem(LOCAL_STORAGE.IS_MASTER_ADMIN, response.isMasterAdmin);
        localStorage.setItem(LOCAL_STORAGE.PERMISSIONS, JSON.stringify(response.permissions));

        setValidateMessage('');
        setValidateResponse(null);

        if (state?.path) {
          redirectTo = state?.path;
        }
      }

      if (!isMfaEnabled) {
        // dispatch(AuthAction.sendLoginOtp(response));
        dispatch(AuthAction.login(response));
      }
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateResponse]);
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
      permissions = await loadPermissions();
    }
    return {
      appSettings,
      permissions
    };
  };

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
              <p className="text-gray-400 dark:text-dark-300">Please sign in to continue</p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-dark-100">
                    {t('mobile')}
                  </label>
                  <div className="relative flex rounded-lg border border-gray-300 bg-white shadow-sm transition-colors duration-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 hover:border-gray-400 dark:border-dark-500 dark:bg-dark-700 dark:focus-within:border-primary-500 dark:hover:border-dark-400">
                    <div className="flex items-center pl-3">
                      <CiMobile1
                        className="size-5 text-gray-400 dark:text-dark-300"
                        strokeWidth="1"
                      />
                      <Controller
                        render={({ field }) => (
                          <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-16 border-none bg-transparent pr-1 text-sm font-medium text-gray-700 outline-none dark:text-dark-100">
                            {countries.map((country) => (
                              <option key={country.PhoneCode} value={country.PhoneCode}>
                                {country.PhoneCode}
                              </option>
                            ))}
                          </select>
                        )}
                        control={control}
                        name="phoneCode"
                      />
                      <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <input
                      type="tel"
                      placeholder={t('enter') + ' ' + t('mobile')}
                      className="flex-1 border-none bg-transparent px-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-dark-100 dark:placeholder-dark-300"
                      {...register('mobile')}
                    />
                  </div>
                  {(errors?.mobile?.message || errors?.phoneCode?.message) && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors?.mobile?.message || errors?.phoneCode?.message}
                    </p>
                  )}
                </div>
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
                  href="/forgot-password"
                  className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100">
                  {t('forgot') + ' ' + t('password')} ?
                </a>
              </div>

              <Button type="submit" className="mt-5 w-full" color="primary" disabled={isLoading}>
                {t('signIn')}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}
