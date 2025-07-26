// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { CiMobile1 } from 'react-icons/ci';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import TenantService from 'services/tenant.services';
import { createBankDepositSchema } from './schema';
import { useDisclosure } from 'hooks';

const CreateBankDeposit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const [show, { toggle }] = useDisclosure();

  const breadcrumbItem = [
    { title: t('manual bank deposit'), path: '/bank' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createBankDepositSchema)
  });

  const createTenantAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await TenantService.createTenant(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/tenant');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await createTenantAPI(data);
  };
  return (
    <Page title={t('create') + ' ' + t('bank_deposit')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('bank_deposit') + ' ' + t('form')}
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
                {...register('bankName')}
                prefix={<UserIcon className="size-5" />}
                label={t('bankName')}
                error={errors?.bankName?.message}
                placeholder={t('enter') + ' ' + t('bankName')}
              />
              <Input
                {...register('accountHolderName')}
                prefix={<UserIcon className="size-5" />}
                label={t('accountHolderName')}
                error={errors?.accountHolderName?.message}
                placeholder={t('enter') + ' ' + t('accountHolderName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('accountNumber')}
                prefix={<UserIcon className="size-5" />}
                label={t('accountNumber')}
                error={errors?.accountNumber?.message}
                placeholder={t('enter') + ' ' + t('accountNumber')}
              />
              <Input
                {...register('bankCode')}
                prefix={<EnvelopeIcon className="size-5" />}
                label={t('bankCode')}
                error={errors?.bankCode?.message}
                placeholder={t('enter') + ' ' + t('bankCode')}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* <Controller
                render={({ field }) => (
                  <Listbox
                    data={tenantStatusOptions}
                    value={
                      tenantStatusOptions.find((status) => status.value === field.value) || null
                    }
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
              /> */}

              <Input
                {...register('upiID')}
                prefix={<CiMobile1 className="size-5" />}
                label={t('enter') + ' ' + t('upiID')}
                error={errors?.upiID?.message}
                placeholder={t('enter') + ' ' + t('upiID')}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label={t('additionalInfo')}
                type={show ? 'text' : 'password'}
                placeholder={t('enter') + ' ' + t('additionalInfo')}
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
                {...register('additionalInfo')}
                error={errors?.additionalInfo?.message}
              />
            </div>
            {/* <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={servicesOptions}
                    value={servicesOptions.find((status) => status.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('add') + ' ' + t('service')}
                    placeholder={t('select') + ' ' + t('service')}
                    displayField="label"
                    error={errors?.service?.message}
                  />
                )}
                control={control}
                name="service"
              />
            </div> */}
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

export default CreateBankDeposit;
//"bankName":"State Bank Of India",
// "accountHolderName":"Akhilesh Rathore 8",
// "accountNumber":"10967899748",
// "bankCode":"SBIN0003493",
// "upiID":"rathoreakhilesh@ybl8",
// "additionalInfo":"{}"
