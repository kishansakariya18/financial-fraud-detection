// Import Dependencies
import { Page } from 'components/shared/Page';
import { UserIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { Button, Input, Skeleton } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import AffiliatesService from 'services/affiliates.services';
import { Listbox } from 'components/shared/form/Listbox';
import { genderOptions } from 'components/sections/player-management/helper';
import { editAffiliateSchema } from './schema';

const EditAffiliate = () => {
  const { t } = useTranslation();
  const { affiliateId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const pageTitle = t('edit') + ' ' + t('affiliate');

  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates/users' },
    { title: t('edit') }
  ];

  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editAffiliateSchema),
    defaultValues: async () => {
      if (affiliateId) {
        const result = await fetchAffiliateDetails();

        if (result) {
          return {
            username: result.affiliates.Username || '',
            firstName: result.affiliates.FirstName || '',
            lastName: result.affiliates.LastName || '',
            dateOfBirth: result.affiliates.DOB || '',
            gender: result.affiliates.Gender === 'Male' || 0 ? 'male' : 'female'
          };
        }
      }
    }
  });
  const fetchAffiliateDetails = async () => {
    const result = await AffiliatesService.getAffiliateDetail({ affiliateId });

    if (result && result.status === 200) {
      const details = result.response.data;
      return details;
    } else {
      return null;
    }
  };

  const editAffiliateApi = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AffiliatesService.editAffiliate(requestObject);
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
      navigate('/affiliates/users');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await editAffiliateApi({ ...data, affiliateUID: affiliateId });
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
                  {...register('username')}
                  prefix={<UserIcon className="size-5" />}
                  label={t('username')}
                  disabled
                  error={errors?.username?.message}
                  placeholder={t('enter') + ' ' + t('username')}
                />
                <Input
                  {...register('firstName')}
                  prefix={<UserIcon className="size-5" />}
                  label={t('firstName')}
                  error={errors?.firstName?.message}
                  placeholder={t('enter') + ' ' + t('firstName')}
                />

                <Input
                  {...register('lastName')}
                  prefix={<UserIcon className="size-5" />}
                  label={t('lastName')}
                  error={errors?.lastName?.message}
                  placeholder={t('enter') + ' ' + t('lastName')}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={genderOptions.map((c) => ({
                        value: c.value,
                        label: c.label
                      }))}
                      searchPlaceholder={t('select') + ' ' + t('gender')}
                      value={
                        genderOptions
                          .map((c) => ({
                            value: c.value,
                            label: c.label
                          }))
                          .find((c) => c.value === field.value) || null
                      }
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('gender')}
                      placeholder={t('select') + ' ' + t('gender')}
                      displayField="label"
                      error={errors?.gender?.message}
                    />
                  )}
                  control={control}
                  name="gender"
                />
                <Input
                  {...register('dateOfBirth')}
                  type="date"
                  label={'Date of Birth'}
                  error={errors?.dateOfBirth?.message}
                />
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

export default EditAffiliate;
