// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input, Select } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createUserClassLimitSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const EditUserClassLimit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { userClassId, userClassLimitId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: t('userClass'), path: '/user-class' },
    { title: t('limits'), path: `/user-class/limits` },
    { title: t('edit') }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(createUserClassLimitSchema)
  });

  const limitTypeOptions = [
    { value: 'Deposit', label: 'Deposit' },
    { value: 'Withdrawal', label: 'Withdrawal' },
    { value: 'Betting', label: 'Betting' },
    { value: 'Loss', label: 'Loss' },
    { value: 'Session', label: 'Session' }
  ];

  const limitPeriodOptions = [
    { value: 'PerTransaction', label: 'Per Transaction' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'INR', label: 'INR' }
  ];

  const statusOptions = [
    { value: 1, label: t('active') },
    { value: 0, label: t('inactive') }
  ];

  useEffect(() => {
    const fetchUserClassLimit = async () => {
      try {
        setInitialLoading(true);
        // TODO: Replace with actual API call to fetch user class limit details
        // const result = await UserClassService.getUserClassLimitDetail(userClassLimitId);
        // if (result.status === 200) {
        //   const data = result.response.data;
        //   reset({
        //     limitType: data.limitType,
        //     limitPeriod: data.limitPeriod,
        //     limitAmount: data.limitAmount,
        //     currencyCode: data.currencyCode,
        //     status: data.status
        //   });
        // } else {
        //   setError(result.error || t('failed_to_fetch_user_class_limit'));
        // }

        // Mock data for now - replace with actual API call
        const mockData = {
          limitType: 'Deposit',
          limitPeriod: 'Daily',
          limitAmount: 1000,
          currencyCode: 'USD',
          status: 1
        };
        reset(mockData);
      } catch (err) {
        console.error('Error fetching user class limit:', err);
        setError(t('something_went_wrong'));
      } finally {
        setInitialLoading(false);
      }
    };

    if (userClassLimitId) {
      fetchUserClassLimit();
    }
  }, [userClassLimitId, reset, t]);

  const updateUserClassLimit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...data,
        userClassLimitId: userClassLimitId,
        userClassId: userClassId
      };

      // TODO: Replace with actual API call to update user class limit
      // const result = await UserClassService.updateUserClassLimit(requestData);
      // if (result.status === 200) {
      //   toast.success(t('user_class_limit_updated'));
      //   navigate(`/user-class/${userClassId}/limits`);
      // } else {
      //   setError(result.error || t('something_went_wrong'));
      // }

      // Mock success for now
      console.log('Updating user class limit with:', requestData);
      toast.success(t('user_class_limit_updated'));
      navigate(`/user-class/${userClassId}/limits`);
    } catch (err) {
      console.error('Error updating user class limit:', err);
      setError(t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    toast.error(error);
  }

  if (initialLoading) {
    return <div>Loading...</div>; // Add a proper loading component here
  }

  return (
    <Page title={t('edit') + ' ' + t('userClass') + ' ' + t('limit')}>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-100">
          <form onSubmit={handleSubmit(updateUserClassLimit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Select
                label={t('limitType')}
                name="limitType"
                control={control}
                options={limitTypeOptions}
                error={errors.limitType?.message}
                required
              />

              <Select
                label={t('limitPeriod')}
                name="limitPeriod"
                control={control}
                options={limitPeriodOptions}
                error={errors.limitPeriod?.message}
                required
              />

              <Input
                label={t('limitAmount')}
                type="number"
                step="0.01"
                {...register('limitAmount')}
                error={errors.limitAmount?.message}
                required
              />

              <Select
                label={t('currencyCode')}
                name="currencyCode"
                control={control}
                options={currencyOptions}
                error={errors.currencyCode?.message}
                required
              />

              <Select
                label={t('status')}
                name="status"
                control={control}
                options={statusOptions}
                error={errors.status?.message}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="plain"
                onClick={() => navigate(`/user-class/${userClassId}/limits`)}
                disabled={loading}>
                {t('cancel')}
              </Button>
              <Button type="submit" loading={loading}>
                {t('update')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default EditUserClassLimit;
