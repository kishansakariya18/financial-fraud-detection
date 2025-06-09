// Import Dependencies
import { LockClosedIcon } from '@heroicons/react/24/outline';

// Local Imports

import { Button, Input, Radio } from 'components/ui';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ProfileService from 'services/profile.services';
import { toast } from 'sonner';
import { changePasswordSchema } from './schema';

export default function PlayerFundPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [passwordType, setPasswordType] = useState('playerFund');

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

  const onPasswordTypeChange = (e) => {
    setPasswordType(e.target.name);
  };

  const changeAffiliateFundPasswordAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await ProfileService.changeAffiliateFundPassword(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const changePlayerFundPasswordAPI = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await ProfileService.changePlayerFundPassword(requestObject);
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
    if (passwordType === 'playerFund') {
      changePlayerFundPasswordAPI(data);
    } else {
      changeAffiliateFundPasswordAPI(data);
    }
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }
  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse('');
    reset();
  }

  useEffect(() => {
    console.log('change password called');
  }, []);
  return (
    <ContentWrapper pageTitle={t('password')} isTable={false}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="w-full max-w-3xl 2xl:max-w-5xl">
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            {t('update') + ' ' + t('transaction') + ' ' + t('password')}
          </p>{' '}
          <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
          <div className="flex flex-wrap gap-5">
            <Radio
              color="primary"
              label={t('player') + ' ' + t('fund') + ' ' + t('password')}
              name="playerFund"
              defaultChecked
              onChange={onPasswordTypeChange}
              checked={passwordType === 'playerFund'}
            />
            <Radio
              color="primary"
              label={t('affiliate') + ' ' + t('fund') + ' ' + t('password')}
              name="affiliateFund"
              onChange={onPasswordTypeChange}
              checked={passwordType === 'affiliateFund'}
            />
          </div>
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
            <Button className="min-w-[7rem]" disabled={() => reset()}>
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
