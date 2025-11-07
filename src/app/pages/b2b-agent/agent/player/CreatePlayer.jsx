import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Local Imports
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Input, Button } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CiMobile1 } from 'react-icons/ci';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import AdminService from 'services/admin.services';
import moment from 'moment-timezone';

const CreatePlayer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  const breadcrumbItem = [
    { title: t('players') || 'Players', path: '/players' },
    { title: t('create') || 'Create' }
  ];

  // Gender options
  const genderOptions = [
    { value: 0, label: t('male') || 'Male' },
    { value: 1, label: t('female') || 'Female' }
  ];

  // Validation schema based on the API payload structure
  const validationSchema = Yup.object({
    firstname: Yup.string()
      .trim()
      .required('First Name Required')
      .max(40, 'Maximum 40 Characters Allowed'),
    lastname: Yup.string()
      .trim()
      .required('Last Name Required')
      .max(40, 'Maximum 40 Characters Allowed'),
    username: Yup.string()
      .trim()
      .required('User Name Required')
      .max(40, 'Maximum 40 Characters Allowed'),
    password: Yup.string()
      .trim()
      .required('Password Required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Minimum 8 Character Required, Atleast One Letter and One Number and One Special Character'
      ),
    email: Yup.string().trim().required('Email Required').email('Invalid Email'),
    mobile: Yup.string()
      .trim()
      .required('Enter Your Mobile Number')
      .length(10, 'Mobile Number Must Contain 10 Digits')
      .matches(/^[0-9\-s]+$/, 'Enter Correct Mobile Number'),
    phoneCode: Yup.string().trim().required('Select Country Code'),
    dateOfBirth: Yup.date()
      .transform((value) => {
        if (value && moment(value).isValid()) {
          return value;
        }
        return null;
      })
      .nullable(),
    gender: Yup.number().oneOf([0, 1], t('invalidGender') || 'Invalid gender selection')
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      dateOfBirth: null,
      phoneCode: null,
      gender: 0
    }
  });

  const fetchCountryList = async () => {
    const result = await AdminService.fetchCountryList();
    if (result.status === 200 || result.status === 201) {
      setCountries(result.response.data);
    }
  };

  const onSubmit = async (data) => {
    await B2BAgentService.createPlayer(data)
      .then((result) => {
        toast.success(result.response.message);
        navigate('/players');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleCancel = () => {
    navigate('/players');
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  return (
    <Page title={`${t('add') || 'Add'} ${t('player') || 'Player'}`}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {`${t('add') || 'Add'} ${t('player') || 'Player'} ${t('form') || 'Form'}`}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('username')}
                prefix={<UserIcon className="size-5" />}
                label={t('username') || 'Username'}
                error={errors?.username?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('username') || 'username'}`}
              />
              <Input
                {...register('firstname')}
                prefix={<UserIcon className="size-5" />}
                label={t('firstName') || 'First Name'}
                error={errors?.firstname?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('firstName') || 'first name'}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('lastname')}
                prefix={<UserIcon className="size-5" />}
                label={t('lastName') || 'Last Name'}
                error={errors?.lastname?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('lastName') || 'last name'}`}
              />
              <Input
                {...register('email')}
                prefix={<EnvelopeIcon className="size-5" />}
                label={t('email') || 'Email'}
                error={errors?.email?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('email') || 'email'} ${t('address') || 'address'}`}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={genderOptions}
                    value={genderOptions.find((gender) => gender.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('gender') || 'Gender'}
                    placeholder={`${t('select') || 'Select'} ${t('gender') || 'gender'}`}
                    displayField="label"
                    error={errors?.gender?.message}
                  />
                )}
                control={control}
                name="gender"
              />

              <Input
                {...register('password')}
                type="password"
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                label={t('password') || 'Password'}
                error={errors?.password?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('password') || 'password'}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={countries.map((c) => ({
                      value: c.PhoneCode,
                      label: `${c.PhoneCode} (${c.CountryCode}) ${c.CountryName}`
                    }))}
                    searchable
                    searchPlaceholder={`${t('search') || 'Search'} ${t('countryCode') || 'country code'}`}
                    value={
                      countries
                        .map((c) => ({
                          value: c.PhoneCode,
                          label: `${c.PhoneCode} (${c.CountryCode}) ${c.CountryName}`
                        }))
                        .find((c) => c.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('countryCode') || 'Country Code'}
                    placeholder={`${t('select') || 'Select'} ${t('countryCode') || 'country code'}`}
                    displayField="label"
                    error={errors?.phoneCode?.message}
                  />
                )}
                control={control}
                name="phoneCode"
              />

              <Input
                {...register('mobile')}
                prefix={<CiMobile1 className="size-5" />}
                label={t('mobile') || 'Mobile'}
                error={errors?.mobile?.message}
                placeholder={`${t('enter') || 'Enter'} ${t('mobile') || 'mobile'} ${t('number') || 'number'}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('dateOfBirth')}
                type="date"
                label={'Date of Birth'}
                error={errors?.dateOfBirth?.message}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              type="button"
              className="min-w-[7rem]"
              onClick={handleCancel}
              disabled={isSubmitting}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
              {isSubmitting ? t('creating') || 'Creating...' : t('create') || 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreatePlayer;
