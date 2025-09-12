import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Input } from 'components/ui';
import { createCallingAgentSchema } from './schema';
import { CiMobile1 } from 'react-icons/ci';
import AgentService from 'services/agent.services';
import AdminService from 'services/admin.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { statusOptions } from '../admin/helper';
import { useSelector } from 'react-redux';

const CreateCallingAgent = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const userData = useSelector((state) => state.auth.userData);

  const breadcrumbItem = [
    { title: t('calling_agents'), path: '/calling-agents/list' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm({
    resolver: yupResolver(createCallingAgentSchema)
  });

  const fetchCountryList = async () => {
    setLoading(true);
    const result = await AdminService.fetchCountryList();
    if (result.status === 200 || result.status === 201) {
      setCountries(result.response.data);
    }
    setLoading(false);
    return { status: result.status, error: result.error };
  };

  const createCallingAgentAPI = async (requestObject) => {
    setError(null);
    await AgentService.createAgent(userData?.AdminUID, requestObject)
      .then((result) => {
        toast.success(result.response.message);
        setTimeout(() => {
          navigate('/calling-agents/list');
        }, 0);
      })
      .catch((err) => {
        toast.error(err || 'Failed to create calling agent');
      });
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  const onSubmit = async (data) => {
    await createCallingAgentAPI(data);
  };

  return (
    <Page title={t('create') + ' ' + t('calling_agent')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('calling_agent') + ' ' + t('form')}
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
                {...register('userName')}
                prefix={<UserIcon className="size-5" />}
                label={t('userName')}
                error={errors?.userName?.message}
                placeholder={t('enter') + ' ' + t('userName')}
              />
              <Input
                {...register('firstName')}
                prefix={<UserIcon className="size-5" />}
                label={t('firstName')}
                error={errors?.firstName?.message}
                placeholder={t('enter') + ' ' + t('firstName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('lastName')}
                prefix={<UserIcon className="size-5" />}
                label={t('lastName')}
                error={errors?.lastName?.message}
                placeholder={t('enter') + ' ' + t('lastName')}
              />
              <Input
                {...register('email')}
                prefix={<EnvelopeIcon className="size-5" />}
                label={t('enter') + ' ' + t('email')}
                error={errors?.email?.message}
                placeholder={t('enter') + ' ' + t('email') + ' ' + t('address')}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={statusOptions}
                    value={statusOptions.find((status) => status.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('status')}
                    placeholder={t('select') + ' ' + t('status')}
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
              />

              <Input
                {...register('password')}
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                label={t('enter') + ' ' + t('password')}
                error={errors?.password?.message}
                placeholder={t('enter') + ' ' + t('password')}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={countries.map((c) => ({
                      value: c.PhoneCode,
                      label: `${c.PhoneCode} (${c.CountryCode}) ${c.CountryName}`
                    }))}
                    searchable
                    searchPlaceholder={t('search') + ' ' + t('countryCode')}
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
                    label={t('countryCode')}
                    placeholder={t('select') + ' ' + t('countryCode')}
                    displayField="label"
                    error={errors?.phoneCode?.message}
                  />
                )}
                control={control}
                name="phoneCode"
              />

              <div className="col-span-2">
                <Input
                  {...register('mobile')}
                  prefix={<CiMobile1 className="size-5" />}
                  label={t('enter') + ' ' + t('mobile')}
                  error={errors?.mobile?.message}
                  placeholder={t('enter') + ' ' + t('mobile') + ' ' + t('number')}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={isSubmitting}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateCallingAgent;
