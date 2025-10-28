// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PlatformLimitService from 'services/platform.services';
import { updatePlatformLimitSchema } from './schema';
import { useTranslation } from 'react-i18next';
import { ContextualHelp } from 'components/shared/ContextualHelp';
import { useCurrencyContext } from 'app/contexts/currency/context';
import { isB2BPlatform } from 'utils/platformNavigation';

const PlatformLimit = () => {
  const { t } = useTranslation();
  const { symbol } = useCurrencyContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const isB2B = isB2BPlatform();

  const pageTitle = t('platform') + ' ' + t('limit');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(updatePlatformLimitSchema)
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPlatformLimit();
      if (result) {
        reset({
          oneTimeBetLimit: result?.BetLimit?.Value || '',
          oneTimeWinLimit: result?.WinLimit?.Value || '',
          dailyDepositLimit: !isB2B ? result?.MaxDepositPerDay?.Value || '' : '',
          dailyWithdrawLimit: result?.MaxWithdrawPerDay?.Value || '',
          isCheckCaladerTime: +result?.CheckCalanderTime?.Value
        });
      }
    };

    loadData();
  }, [reset, isB2B]);

  const updatePlatformLimit = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PlatformLimitService.updatePlatformLimit(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchPlatformLimit = async () => {
    setError(null);
    const result = await PlatformLimitService.getPlatoformLimit();
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const details = result.response.data;
        return details;
      } else {
        setError(result.error);
      }
    }
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    fetchPlatformLimit();
  }

  const onSubmit = async (data) => {
    await updatePlatformLimit(data);
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {!isB2B && (
                <Input
                  {...register('dailyDepositLimit')}
                  label={t('dailyDepositLimitPlatform')}
                  type="number"
                  step="any"
                  minLength={1}
                  maxLength={10}
                  error={errors?.dailyDepositLimit?.message}
                  placeholder="Enter Daily Deposit Limit"
                  prefix={symbol}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'e' ||
                      e.key === 'E' ||
                      e.key === '+' ||
                      e.key === '-' ||
                      e.key === ' '
                    ) {
                      e.preventDefault();
                    }
                  }}
                  suffix={
                    <ContextualHelp
                      title={t('dailyDepositLimitPlatform')}
                      anchor={{ to: 'bottom', gap: 8 }}
                      content={<p>{t('dailyDepositLimitPlatformDesc')}</p>}
                    />
                  }
                />
              )}
              <Input
                {...register('dailyWithdrawLimit')}
                label={t('dailyWithdrawLimitPlatform')}
                type="number"
                step="any"
                minLength={1}
                maxLength={10}
                error={errors?.dailyWithdrawLimit?.message}
                placeholder="Enter Daily Withdraw Limit"
                prefix={symbol}
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' ||
                    e.key === 'E' ||
                    e.key === '+' ||
                    e.key === '-' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                  }
                }}
                suffix={
                  <ContextualHelp
                    title={t('dailyWithdrawLimitPlatform')}
                    anchor={{ to: 'bottom', gap: 8 }}
                    content={<p>{t('dailyWithdrawLimitPlatformDesc')}</p>}
                  />
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('oneTimeBetLimit')}
                label={t('oneTimeBetLimitPlatform')}
                type="number"
                step="any"
                minLength={1}
                maxLength={10}
                error={errors?.oneTimeBetLimit?.message}
                placeholder="Enter Bet Limit"
                prefix={symbol}
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' ||
                    e.key === 'E' ||
                    e.key === '+' ||
                    e.key === '-' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                  }
                }}
                suffix={
                  <ContextualHelp
                    title={t('oneTimeBetLimitPlatform')}
                    anchor={{ to: 'bottom', gap: 8 }}
                    content={<p>{t('oneTimeBetLimitPlatformDesc')}</p>}
                  />
                }
              />
              <Input
                {...register('oneTimeWinLimit')}
                label={t('oneTimeWinLimitPlatform')}
                type="number"
                step="any"
                minLength={1}
                maxLength={10}
                error={errors?.oneTimeWinLimit?.message}
                placeholder="Enter Win Limit"
                prefix={symbol}
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' ||
                    e.key === 'E' ||
                    e.key === '+' ||
                    e.key === '-' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                  }
                }}
                suffix={
                  <ContextualHelp
                    title={t('oneTimeWinLimitPlatform')}
                    anchor={{ to: 'bottom', gap: 8 }}
                    content={<p>{t('oneTimeWinLimitPlatformDesc')}</p>}
                  />
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox label={t('checkCalenderTime')} {...register('isCheckCaladerTime')} />
              <ContextualHelp
                title={t('checkCalenderTime')}
                anchor={{ to: 'bottom', gap: 8 }}
                content={<p>{t('checkCalenderTimeDesc')}</p>}
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

export default PlatformLimit;
