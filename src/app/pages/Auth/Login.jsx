// Import Dependencies
import { useLocation, useNavigate } from 'react-router';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// Local Imports
import Logo from 'assets/appLogo.svg?react';
import { Button, Card, Checkbox, Input } from 'components/ui';
import { loginSchema } from './schema';
import { Page } from 'components/shared/Page';
import AuthService from 'services/auth.services';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: ''
    }
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [validateResponse, setValidateResponse] = useState(null);
  const [validateMessage, setValidateMessage] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.login(data);
    if (result) {
      if (result.status === 200) {
        if (!result.response.data?.mfaEnabled) {
          localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, result.response.data.UserToken);
          const responseData = await performPostLoginActions();
          setResponse({
            message: result.response.message,
            adminData: result.response.data.adminData,
            appSettings: responseData.appSettings,
            permissions: responseData.permissions.permissions,
            isMasterAdmin: responseData.permissions.isMasterAdmin
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
        redirectTo = `/otp-verification?token=${validateResponse.token}&&mobile=${validateResponse.mobile}&&UserToken=${validateResponse.UserToken}&&password=${validateResponse.userPassword}`;
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

    if (appSettingData) {
      const sportsList = appSettingData.SportsList;

      let sportsConfig = {};

      for (let i = 0; i < sportsList.length; i++) {
        let EntryFeeIn = sportsList[i]['EntryFeeIn'] || null;
        let PrizeIn = sportsList[i]['PrizeIn'] || null;

        if (EntryFeeIn) {
          EntryFeeIn = {
            CURRENCY: EntryFeeIn?.RealCash,
            COIN: EntryFeeIn?.Coin
          };
        }

        if (PrizeIn) {
          PrizeIn = {
            CURRENCY: PrizeIn?.RealCash,
            COIN: PrizeIn?.Coin,
            GADGET: PrizeIn?.Gadget
          };
        }

        let sportId = sportsList[i]['SportsID'];
        sportsConfig[sportId] = {
          ENTRY_FEE_IN: EntryFeeIn,
          PRIZE_IN: PrizeIn
        };
      }

      appSettingData.Config = sportsConfig;
    }

    return appSettingData;
  };

  const loadPermissions = async () => {
    const result = await AuthService.loadAdminPermissions();
    const permissionData = result?.response?.data || {};

    const isMasterAdmin = permissionData?.MasterAdmin || 0;
    const permissions = permissionData?.permissions || [];

    const permissionList = permissions.map((permission) => {
      return permission.SlugName;
    });

    return {
      isMasterAdmin,
      permissions: permissionList
    };
  };

  const performPostLoginActions = async () => {
    const appSettings = await loadInitialVariables();
    const permissions = await loadPermissions();

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
            <Logo className="mx-auto size-16" />
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
                <Input
                  label={t('mobile')}
                  placeholder={t('enter') + ' ' + t('mobile')}
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register('mobile')}
                  error={errors?.mobile?.message}
                />
                <Input
                  label={t('password')}
                  placeholder={t('enter') + ' ' + t('password')}
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
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
