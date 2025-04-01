// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Checkbox, Input } from 'components/ui';
import { createAdminSchema } from './schema';
import { CiMobile1 } from 'react-icons/ci';
import AdminService from 'services/admin.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { statusOptions } from './helper';

const CreateAdmin = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const breadcrumbItem = [{ title: t('admin'), path: '/admin' }, { title: t('create') }];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    resolver: yupResolver(createAdminSchema)
  });

  const fetchRoles = async () => {
    setLoading(true);
    const result = await AdminService.getAdminRole();

    if (result && result.status === 200) {
      const roles = result.response.data;

      const roleList = roles.map((role) => {
        return {
          value: role.RoleID,
          label: role.RoleName
        };
      });

      setRoles(roleList);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const createAdminAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AdminService.createAdmin(requestObject);
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
    fetchRoles();
  }, []);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/admin');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await createAdminAPI(data);
  };
  return (
    <Page title={t('create') + ' ' + t('admin')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('admin') + ' ' + t('form')}
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
                    data={roles}
                    value={roles.find((role) => role.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('roles')}
                    placeholder={t('select') + ' ' + t('roles')}
                    displayField="label"
                    error={errors?.roles?.message}
                  />
                )}
                control={control}
                name="roles"
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
                {...register('mobile')}
                prefix={<CiMobile1 className="size-5" />}
                label={t('enter') + ' ' + t('mobile')}
                error={errors?.mobile?.message}
                placeholder={t('enter') + ' ' + t('mobile') + ' ' + t('number')}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Checkbox label={t('isMasterAdmin')} {...register('isMasterAdmin')} />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateAdmin;
