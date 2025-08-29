// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Input, Skeleton } from 'components/ui';
import { editSupervisorSchema } from './schema';
import { CiMobile1 } from 'react-icons/ci';
import AdminService from 'services/admin.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { parseAdminStatusToApp, statusOptions } from './helper';
import { useTranslation } from 'react-i18next';
import SupervisorService from 'services/supervisor.services';

const EditSupervisor = () => {
  const { t } = useTranslation();
  const { supervisorId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [countries, setCountries] = useState([]);
  const pageTitle = t('edit') + ' ' + t('supervisor');

  const breadcrumbItem = [
    { title: t('supervisor'), path: '/users/supervisor' },
    { title: t('edit') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(editSupervisorSchema),
    defaultValues: async () => {
      if (supervisorId) {
        const result = await fetchSupervisorDetails();

        if (result) {
          return {
            userName: result.Username || '',
            firstName: result.FirstName || '',
            lastName: result.LastName || '',
            email: result.Email || '',
            roles: result.RoleID,
            status: parseAdminStatusToApp(result.AccountStatus) || 'inactive',
            mobile: result.Mobile || '',
            isMasterAdmin: result.IsSuperAdmin || false
          };
        }
      }
    }
  });

  const fetchSupervisorDetails = async () => {
    const result = await SupervisorService.getSupervisorDetail(supervisorId);
    if (result && result.status === 200) {
      const details = result.response.data;
      return details;
    } else {
      return null;
    }
  };

  const fetchCountries = async () => {
    setLoading(true);
    const result = await AdminService.fetchCountryList();
    if (result.status === 200 || result.status === 201) {
      setCountries(result.response.data);
    }
    setLoading(false);
    return { status: result.status, error: result.error };
  };

  const editSupervisorApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await SupervisorService.editSupervisor(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, [supervisorId]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/users/supervisor');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await editSupervisorApi({ ...data, adminUID: supervisorId });
  };
  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {loading &&
            [...Array(10)].map((_, i) => (
              <Skeleton className="grid gap-4 sm:grid-cols-2" key={i} />
            ))}
          {!loading && (
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
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid grid-cols-3 gap-2">
                  <Controller
                    render={({ field }) => (
                      <Listbox
                        data={countries.map((c) => ({
                          value: c.PhoneCode,
                          label: `${c.PhoneCode} ${c.CountryName}`
                        }))}
                        searchable
                        searchPlaceholder={t('search') + ' ' + t('countryCode')}
                        value={
                          countries
                            .map((c) => ({
                              value: c.PhoneCode,
                              label: `${c.PhoneCode} ${c.CountryName}`
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
            </div>
          )}
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditSupervisor;
