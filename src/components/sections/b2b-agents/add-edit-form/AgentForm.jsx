// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Button, Input } from 'components/ui';
import { createAgentFormSchema, editAgentFormSchema } from './schema';
import { CiMobile1 } from 'react-icons/ci';
import AdminService from 'services/admin.services';
import CommissionForm from './CommissionForm';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  mapAgentdata,
  parseAgentStatusToApi,
  parseAgentStatusToApp,
  statusOptions,
  mapCommissionsToApi
} from 'components/sections/b2b-agents/helper';

const AgentForm = ({
  mode = 'add',
  onFetchAgentDetails,
  onCreateAgent,
  onEditAgent,
  breadcrumbItem,
  pageTitle = 'Agent',
  onNavigateBack
}) => {
  const [countries, setCountries] = useState([]);
  const [agentData, setAgentData] = useState(null);
  const { t } = useTranslation();
  const { agentUID } = useParams();
  const [loading, setLoading] = useState(false);
  const isEdit = mode === 'edit';

  const defaultValues = useMemo(
    () => ({
      phoneCode: '',
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      mobile: '',
      ...(agentData || {}),
      status: agentData?.status ? parseAgentStatusToApp(agentData?.status) : 'active',
      password: '',
      commissionPercent: agentData?.commissionPercent || null,
      commissions: mapCommissionsToApi(agentData?.commissions) || []
    }),
    [agentData]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch
  } = useForm({
    resolver: yupResolver(isEdit ? editAgentFormSchema : createAgentFormSchema),
    mode: 'onChange',
    defaultValues
  });

  const fetchAgentDetails = () => {
    if (!isEdit || !agentUID || !onFetchAgentDetails) return;
    setLoading(true);
    onFetchAgentDetails(agentUID)
      .then((res) => {
        setAgentData(mapAgentdata(res.response?.data));
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to fetch agent details');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCountryList = async () => {
    const result = await AdminService.fetchCountryList();
    if (result.status === 200 || result.status === 201) {
      setCountries(result.response.data);
    }
  };

  const submitAgent = async (requestObject) => {
    const apiData = {
      username: requestObject.username,
      firstname: requestObject.firstname,
      lastname: requestObject.lastname,
      email: requestObject.email,
      phoneCode: requestObject.phoneCode,
      mobile: requestObject.mobile,
      status: parseAgentStatusToApi(requestObject.status),
      commissionPercent: requestObject.commissionPercent,
      commissions: mapCommissionsToApi(requestObject.commissions)
    };

    // Only include password if it's provided
    if (requestObject.password && requestObject.password.trim()) {
      apiData.password = requestObject.password;
    }

    let promiseRes;
    if (isEdit && onEditAgent) {
      promiseRes = onEditAgent(agentUID, apiData);
    } else if (!isEdit && onCreateAgent) {
      // For create, password is required
      if (!requestObject.password || !requestObject.password.trim()) {
        toast.error('Password is required');
        return;
      }
      apiData.password = requestObject.password;
      promiseRes = onCreateAgent(apiData);
    } else {
      toast.error('Action not available');
      return;
    }

    promiseRes
      .then((res) => {
        toast.success(
          res.response?.message || `Agent ${isEdit ? 'updated' : 'created'} successfully`
        );
        onNavigateBack?.();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    fetchCountryList();
    if (isEdit) {
      fetchAgentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, agentUID]);

  const handleReset = () => {
    reset();
  };

  useEffect(() => {
    console.log(defaultValues, 576846);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  if (loading && isEdit && !agentData) {
    return (
      <Page title={`${isEdit ? t('edit') || 'Edit' : t('add') || 'Add'} ${t('agent') || 'Agent'}`}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('loading') || 'Loading agent details...'}
            </p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title={`${isEdit ? t('edit') || 'Edit' : t('add') || 'Add'} ${pageTitle}`}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {`${isEdit ? t('edit') || 'Edit' : t('add') || 'Add'} ${pageTitle} ${t('form') || 'Form'}`}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(submitAgent)} autoComplete="off">
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
                    data={statusOptions}
                    value={statusOptions.find((status) => status.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('status') || 'Status'}
                    placeholder={`${t('select') || 'Select'} ${t('status') || 'status'}`}
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
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
                placeholder={
                  isEdit
                    ? `${t('enter') || 'Enter'} ${t('password') || 'password'} ${t('optional') || '(optional)'}`
                    : `${t('enter') || 'Enter'} ${t('password') || 'password'}`
                }
              />
            </div>

            {/* Commission Percentage */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h6 className="mb-3 text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('credit_lineup')}
              </h6>
              <Input
                {...register('commissionPercent')}
                type="number"
                step="0.01"
                min="0"
                max="100"
                prefix={<span className="text-sm">%</span>}
                label={
                  t('commission') + ' ' + t('percentage') + ' (%)' || 'Commission Percentage (%)'
                }
                error={errors?.commissionPercent?.message}
                placeholder="0.00"
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

            {/* Commission Form Section */}
            <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-dark-500">
              <CommissionForm control={control} register={register} errors={errors} watch={watch} />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
              {t('reset') || 'Reset'}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {loading
                ? isEdit
                  ? t('updating') || 'Updating...'
                  : t('creating') || 'Creating...'
                : isEdit
                  ? t('update') || 'Update'
                  : t('create') || 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

AgentForm.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit']),
  onFetchAgentDetails: PropTypes.func,
  onCreateAgent: PropTypes.func,
  onEditAgent: PropTypes.func,
  breadcrumbItem: PropTypes.array,
  pageTitle: PropTypes.string,
  onNavigateBack: PropTypes.func
};

export default AgentForm;
