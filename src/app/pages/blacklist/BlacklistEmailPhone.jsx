// Import Dependencies
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Listbox } from 'components/shared/form/Listbox';
import { Input, Button, Textarea } from 'components/ui';
import { blacklistEmailPhoneSchema } from './schema';
import BlacklistService from 'services/blacklist.services';
import { toast } from 'sonner';

const BlacklistEmailPhone = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { label: t('email'), value: 'email' },
    { label: t('phone_number'), value: 'mobile' }
  ];

  const breadcrumbItem = [
    {
      title: t('blacklisted') + ' ' + t('email') + '/' + t('phone_number'),
      path: '/blacklist/tab/email-phone'
    },
    { title: t('blacklist') }
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(blacklistEmailPhoneSchema),
    defaultValues: { type: '', value: '', reason: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await BlacklistService.blacklist({
      type: data.type,
      value: data.value,
      reason: data.reason
    });
    setLoading(false);
    if (result && (result.status === 200 || result.status === 201)) {
      toast.success(t('blacklist_success'));
      setTimeout(() => {
        navigate('/blacklist/tab/email-phone');
      }, 0);
    } else {
      toast.error(result?.error || t('something_went_wrong'));
    }
  };

  return (
    <Page title={t('blacklist') + ' ' + t('email') + '-' + t('phone_number')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('blacklist') + ' ' + t('email') + '-' + t('phone_number')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={typeOptions}
                    value={typeOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('select') + ' ' + t('type')}
                    placeholder={t('select') + ' ' + t('type')}
                    displayField="label"
                    error={errors?.type?.message}
                  />
                )}
              />
              <Input
                {...register('value')}
                label={t('value')}
                error={errors?.value?.message}
                placeholder={t('enter') + ' ' + t('value')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea
                {...register('reason')}
                label={t('reason')}
                error={errors?.reason?.message}
                placeholder={t('enter') + ' ' + t('reason')}
                rows={1}
                className="sm:col-span-2"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              type="button"
              onClick={() => reset()}
              disabled={loading}>
              {t('clear')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('blacklist')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default BlacklistEmailPhone;
