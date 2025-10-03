// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import UserClassService from 'services/user-class.services';
import { createUserClassSchema } from './schema';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { userclassStatusToAPP } from './helper';
import { useCurrencyContext } from 'app/contexts/currency/context';
import { isB2CPlatform } from 'utils/platformNavigation';

const EditUserClass = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userClassUID } = useParams();

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const { symbol } = useCurrencyContext();
  const isB2C = isB2CPlatform();
  const breadcrumbItem = [{ title: t('userClass'), path: '/user-class' }, { title: t('edit') }];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createUserClassSchema(isB2C))
  });
  const editUserClassAPI = async (data) => {
    console.log('Update request data:', { data });
    setLoading(true);
    setError(null);

    try {
      const result = await UserClassService.userClassUpdate(data);
      console.log('Update response:', result);

      if (result) {
        if (result.status === 200 || result.status === 201) {
          setResponse(result.response);
          return true;
        }
        setError(result.error || 'Failed to update user class');
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error updating user class:', error);
      setError(error.message || 'An error occurred while updating the user class');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserClassDetails = async () => {
    try {
      const result = await UserClassService.userClassDetail(userClassUID);
      if (result) {
        if (result.status === 200 || result.status === 201) {
          return result.response.data;
        }
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching user class details:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (userClassUID) {
      fetchUserClassDetails().then((result) => {
        if (result) {
          const depositRule = Array.isArray(result?.rules)
            ? result.rules.find((r) => r?.RuleType === 'deposit')
            : undefined;
          const wagerRule = Array.isArray(result?.rules)
            ? result.rules.find((r) => r?.RuleType === 'wager')
            : undefined;
          const depositVal = depositRule?.Threshold;
          const wagerVal = wagerRule?.Threshold;
          const mappedData = {
            className: result?.ClassName,
            classCode: result?.ClassCode,
            status: result.IsActive ? userclassStatusToAPP(result.IsActive) : undefined,
            deposit: depositVal ?? undefined,
            wager: wagerVal ?? undefined
          };
          reset(mappedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClassUID]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    navigate('/user-class');
    setResponse(null);
    fetchUserClassDetails();
  }

  const onSubmit = async (formData) => {
    console.log('Form submitted:', formData);

    const requestData = {
      classUID: userClassUID,
      className: formData.className,
      classCode: formData.classCode,
      deposit: formData.deposit,
      wager: formData.wager
    };

    editUserClassAPI(requestData);
  };
  return (
    <Page title={t('edit') + ' ' + t('userClass')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('userClass') + ' ' + t('form')}
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
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditUserClass;
