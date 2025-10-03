// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import UserClassService from 'services/user-class.services';
import { createUserClassSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useCurrencyContext } from 'app/contexts/currency/context';
import { isB2CPlatform } from 'utils/platformNavigation';

const CreateUserClass = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const { symbol } = useCurrencyContext();
  const isB2C = isB2CPlatform();

  const breadcrumbItem = [{ title: t('userClass'), path: '/user-class' }, { title: t('create') }];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createUserClassSchema(isB2C))
  });

  const creatUserClassAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await UserClassService.createUserClass(requestObject);
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

  useEffect(() => {
    if (!loading && !error && response) {
      toast.success(response.message);
      setResponse(null);
      reset();
      navigate('/user-class');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const onSubmit = async (data) => {
    await creatUserClassAPI(data);
  };

  return (
    <Page title={t('create') + ' ' + t('userClass')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('userClass') + ' ' + t('form')}
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
                {...register('className')}
                label={t('class_name')}
                error={errors?.className?.message}
                placeholder={t('enter') + ' ' + t('class_name')}
              />
              <Input
                {...register('classCode')}
                label={t('class_code')}
                error={errors?.classCode?.message}
                placeholder={t('enter') + ' ' + t('class_code')}
              />
              {isB2C && (
                <Input
                  {...register('deposit', { valueAsNumber: true })}
                  type="number"
                  label={t('deposit')}
                  step="any"
                  error={errors?.deposit?.message}
                  placeholder={t('enter') + ' ' + t('deposit')}
                  prefix={symbol}
                />
              )}
              <Input
                {...register('wager', { valueAsNumber: true })}
                type="number"
                label={t('wager')}
                step="any"
                error={errors?.wager?.message}
                placeholder={t('enter') + ' ' + t('wager')}
                prefix={symbol}
              />
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

export default CreateUserClass;
