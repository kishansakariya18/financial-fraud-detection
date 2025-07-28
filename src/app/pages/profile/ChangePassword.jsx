// Import Dependencies
import { LockClosedIcon } from '@heroicons/react/24/outline';

// Local Imports

import { Button, Input } from 'components/ui';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ProfileService from 'services/profile.services';
import { toast } from 'sonner';
import { changePasswordSchema } from './schema';

export default function ChangePassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [initialValues] = useState({
    currentPassword: '',
    newPassword: '',
    verifyPassword: ''
  });

  const handleReset = () => {
    reset(initialValues);
    setError('');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      verifyPassword: ''
    }
  });

  const changePasswordAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await ProfileService.changePassword(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const onSubmit = (data) => {
    changePasswordAPI(data);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse('');
    handleReset();
  }

  useEffect(() => {
    console.log('change password called');
  }, []);
  return (
    <ContentWrapper pageTitle={t('profile')} isTable={false}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="w-full max-w-3xl 2xl:max-w-5xl">
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            {t('update') + ' ' + t('password')}
          </p>{' '}
          <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
            {t('update_password_desc')}
          </p>
          <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
          <div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-1 [&_.prefix]:pointer-events-none">
              <Input
                placeholder={t('enter') + ' ' + t('current') + ' ' + t('password')}
                label={t('current') + ' ' + t('password')}
                className="rounded-xl"
                prefix={<LockClosedIcon className="size-4.5" />}
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
              <Input
                placeholder={t('enter') + ' ' + t('new_key') + ' ' + t('password')}
                label={t('new_key') + ' ' + t('password')}
                className="rounded-xl"
                prefix={<LockClosedIcon className="size-4.5" />}
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Input
                placeholder={t('enter') + ' ' + t('confirm') + ' ' + t('password')}
                label={t('confirm') + ' ' + t('password')}
                className="rounded-xl"
                prefix={<LockClosedIcon className="size-4.5" />}
                {...register('verifyPassword')}
                error={errors.verifyPassword?.message}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
              {t('reset')}
            </Button>
            <Button className="min-w-[7rem]" color="primary" type="submit" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </div>
      </form>
    </ContentWrapper>
  );
}
