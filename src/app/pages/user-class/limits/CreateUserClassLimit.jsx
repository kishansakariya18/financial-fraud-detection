// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import UserClassService from 'services/user-class.services';
import { createUserClassLimitSchema } from './schema';
import { USER_CLASS_LIMIT_TYPE, USER_CLASS_LIMIT_PERIOD } from 'constants/app.constant';
const CreateUserClassLimit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userClassUID } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(createUserClassLimitSchema),
    defaultValues: {
      status: 1 // Default to active
    }
  });

  const limitTypeOptions = [
    { value: 'deposit', label: USER_CLASS_LIMIT_TYPE.DEPOSIT },
    { value: 'withdraw', label: USER_CLASS_LIMIT_TYPE.WITHDRAW },
    { value: 'wager', label: USER_CLASS_LIMIT_TYPE.WAGER },
    { value: 'loss', label: USER_CLASS_LIMIT_TYPE.LOSS }
  ];

  const limitPeriodOptions = [
    { value: 'daily', label: USER_CLASS_LIMIT_PERIOD.DAILY },
    { value: 'weekly', label: USER_CLASS_LIMIT_PERIOD.WEEKLY },
    { value: 'monthly', label: USER_CLASS_LIMIT_PERIOD.MONTHLY }
  ];

  const createUserClassLimit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const requestData = {
        userClassID: userClassUID,
        limitType: data.limitType,
        limitPeriod: data.limitPeriod,
        limitAmount: data.limitAmount
      };

      const result = await UserClassService.createUserClassLimit(requestData);
      if (result.status === 200 || result.status === 201) {
        toast.success(result.response.message);
        navigate(`/user-class/${userClassUID}/limits`);
      } else {
        setError(result.response.message || t('something_went_wrong'));
      }
    } catch (err) {
      console.error('Error creating user class limit:', err);
      setError(t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <Page title={t('create') + ' ' + t('userClass') + ' ' + t('limit')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('userClass') + ' ' + t('limit')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(createUserClassLimit)} className="space-y-6">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <Controller
                name="limitType"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={limitTypeOptions}
                    value={limitTypeOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('limit_type')}
                    placeholder={t('select') + ' ' + t('limit_type')}
                    displayField="label"
                    error={errors.limitType?.message}
                    required
                  />
                )}
              />

              <Controller
                name="limitPeriod"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={limitPeriodOptions}
                    value={limitPeriodOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('limit_period')}
                    placeholder={t('select') + ' ' + t('limit_period')}
                    displayField="label"
                    error={errors.limitPeriod?.message}
                    required
                  />
                )}
              />

              <Input
                label={t('limit_amount')}
                type="number"
                {...register('limitAmount')}
                error={errors.limitAmount?.message}
                placeholder={t('enter') + ' ' + t('limitAmount')}
              />
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                className="min-w-[7rem]"
                onClick={() => navigate(`/user-class/${userClassUID}/limits`)}
                disabled={loading}
                variant="outlined">
                {t('cancel')}
              </Button>
              <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
                {t('create')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateUserClassLimit;
