// Import Dependencies
import { XMarkIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';

// Local Imports
import { PreviewImg } from 'components/shared/PreviewImg';
import { Avatar, Button, Input, InputErrorMsg, Upload } from 'components/ui';
// import { Page } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { editProfileSchema } from './schema';
import { Controller, useForm } from 'react-hook-form';
import ProfileService from 'services/profile.services';
import { toast } from 'sonner';
import apiConfig from 'configs/api.config';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { PhoneDialCode } from 'components/custom/PhoneDialCode';
import AdminService from 'services/admin.services';

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const userData = useSelector((data) => data.auth.userData);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      firstName: userData?.FirstName,
      lastName: userData?.LastName,
      email: userData?.Email,
      mobile: userData?.Mobile,
      userName: userData?.Username,
      phoneCode: userData?.PhoneCode || '+1'
    }
  });

  const [countries, setCountries] = useState([]);

  const fetchCountryList = async () => {
    try {
      const result = await AdminService.fetchCountryList();
      if (result.status === 200 || result.status === 201) {
        const countries = result.response.data.map((c) => {
          return {
            phoneCode: c.PhoneCode,
            name: c.CountryName,
            code: c.CountryCode
          };
        });
        setCountries(countries);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const updateProfileAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await ProfileService.updateProfile(requestObject, avatar);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const onSubmit = (data) => {
    updateProfileAPI(data);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  useEffect(() => {
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (!loading && !error && response) {
      localStorage.setItem(LOCAL_STORAGE.AUTH_EMAIL, response?.data?.Email);
      localStorage.setItem(LOCAL_STORAGE.USER_DATA, JSON.stringify(response?.data));
      dispatch(AuthAction.updateUserData(response.data));
      toast.success(response.message);
      setResponse(null);
      setAvatar(null);
      reset({
        firstName: response?.data?.FirstName,
        lastName: response?.data?.LastName,
        email: response?.data?.Email,
        mobile: response?.data?.Mobile,
        userName: response?.data?.Username,
        phoneCode: response?.data?.PhoneCode
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <ContentWrapper pageTitle={t('profile')} isTable={false}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="w-full max-w-3xl 2xl:max-w-5xl">
          <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">{t('profile')}</h5>
          <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
            {t('profile_desc')}
          </p>
          <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
          <div className="mt-4 flex flex-col space-y-1.5">
            <span className="text-base font-medium text-gray-800 dark:text-dark-100">Avatar</span>
            <Avatar
              size={20}
              imgComponent={PreviewImg}
              imgProps={{ file: avatar }}
              {...((userData?.ImageName || avatar) && {
                src: avatar
                  ? URL.createObjectURL(avatar)
                  : `${apiConfig.baseURL.S3_URL}/admin/${userData.ImageName}`
              })}
              name={userData?.FirstName + ' ' + userData?.LastName}
              classNames={{
                root: 'rounded-xl ring-primary-600 ring-offset-[3px] ring-offset-white transition-all hover:ring dark:ring-primary-500 dark:ring-offset-dark-700',
                display: 'rounded-xl'
              }}
              indicator={
                <div className="absolute bottom-0 right-0 -m-1 flex items-center justify-center rounded-full bg-white dark:bg-dark-700">
                  {avatar ? (
                    <Button onClick={() => setAvatar(null)} isIcon className="size-6 rounded-full">
                      <XMarkIcon className="size-4" />
                    </Button>
                  ) : (
                    <Upload name="avatar" onChange={setAvatar} accept="image/*">
                      {({ ...props }) => (
                        <Button isIcon className="size-6 rounded-full" {...props}>
                          <HiPencil className="size-3.5" />
                        </Button>
                      )}
                    </Upload>
                  )}
                </div>
              }
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&_.prefix]:pointer-events-none">
            <Input
              label={t('username')}
              className="rounded-xl"
              defaultValue={userData?.Username}
              disabled
              prefix={<UserIcon className="size-4.5" />}
              {...register('userName')}
              error={errors.userName?.message}
            />
            <Input
              placeholder={t('enter') + ' ' + t('firstName')}
              label={t('firstName')}
              className="rounded-xl"
              prefix={<UserIcon className="size-4.5" />}
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              placeholder={t('enter') + ' ' + t('lastName')}
              label={t('lastName')}
              className="rounded-xl"
              prefix={<UserIcon className="size-4.5" />}
              {...register('lastName')}
              error={errors.lastName?.message}
            />
            <Input
              placeholder={t('enter') + ' ' + t('email')}
              label={t('email')}
              className="rounded-xl"
              prefix={<EnvelopeIcon className="size-4.5" />}
              {...register('email')}
              error={errors.email?.message}
            />
            <div className="flex flex-col">
              <span>{t('mobile')}</span>
              <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                <Controller
                  render={({ field: { onChange, value, name } }) => (
                    <PhoneDialCode
                      onChange={onChange}
                      value={value}
                      name={name}
                      error={Boolean(errors?.phoneCode)}
                      countries={countries}
                    />
                  )}
                  control={control}
                  name="phoneCode"
                />
                <Input
                  {...register('mobile')}
                  classNames={{
                    root: 'flex-1',
                    input: 'hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none'
                  }}
                  error={Boolean(errors?.mobile)}
                  placeholder={t('enter') + ' ' + t('mobile')}
                />
              </div>
              <InputErrorMsg when={errors?.phoneCode || errors?.mobile}>
                {errors?.phoneCode?.message ?? errors?.mobile?.message}
              </InputErrorMsg>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()}>
              {t('reset')}
            </Button>
            <Button className="min-w-[7rem]" color="primary" type="submit" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </div>
      </form>
    </ContentWrapper>
  );
}
