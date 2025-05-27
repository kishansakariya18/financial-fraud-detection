// Local Imports
import { Box, Button, Input, Skeleton, Switch } from 'components/ui';
import { Page } from 'components/shared/Page';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import PlayerService from 'services/player.services';
import { ContextualHelp } from 'components/shared/ContextualHelp';
import { playerLimitSchema } from './schema';
import { Listbox } from 'components/shared/form/Listbox';
import { DatePicker } from 'components/shared/form/Datepicker';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';

const exclusionTimeOptions = [
  { label: '1 day', value: 1 },
  { label: '7 day', value: 2 },
  { label: '1 month', value: 3 },
  { label: '6 month', value: 4 },
  { label: '12 month', value: 5 },
  { label: 'Custom', value: 6 },
  { label: 'Permenent', value: 7 }
];

const PlayerLimit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { playerId } = useParams();
  const [exclusionType, setExclusionType] = useState('');
  const { t } = useTranslation();
  const pageTitle = t('player') + ' ' + t('limit');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(playerLimitSchema)
  });

  console.log('errors: ', errors);

  useEffect(() => {
    if (playerId) {
      fetchUserDetails().then((result) => {
        if (result) {
          setExclusionType(result.ExclusionType);
          reset({
            dailyWagerLimit: result.BetDailyWageLimit,
            weeklyWagerLimit: result.BetWeeklyWageLimit,
            monthlyWagerLimit: result.BetMonthlyWageLimit,
            dailyDepositLimit: result.MaxDepositPerMonth,
            weeklyDepositLimit: result.MaxDepositPerWeek,
            monthlyDepositLimit: result.MaxDepositPerMonth,
            dailyWithdrawLimit: result.MaxWithdrawPerDay,
            weeklyWithdrawLimit: result.MaxWithdrawPerWeek,
            monthlyWithdrawLimit: result.MaxWithdrawPerMonth,
            dailyLossLimit: result.DailyLossLimit,
            weeklyLossLimit: result.WeeklyLossLimit,
            monthlyLossLimit: result.MonthlyLossLimit,
            selfExclusionType: result.ExclusionType,
            exclusionStartAt: result.ExclusionStartAt
              ? getDateInUTCToTimeZone(result.ExclusionStartAt, 'Asia/Kolkata', 'YYYY-MM-DD HH:mm')
              : null,
            exclusionEndAt: result.ExclusionEndAt
              ? getDateInUTCToTimeZone(result.ExclusionEndAt, 'Asia/Kolkata', 'YYYY-MM-DD HH:mm')
              : null,

            // Flags
            hasDailyWagerLimit: result.HasDailyBetWageLimit,
            hasWeeklyWagerLimit: result.HasWeeklyBetWageLimit,
            hasMonthlyWagerLimit: result.HasMonthlyBetWageLimit,
            hasDailyDepositLimit: result.HasMaxDepositPerDayLimit,
            hasWeeklyDepositLimit: result.HasMaxDepositPerWeekLimit,
            hasMonthlyDepositLimit: result.HasMaxDepositPerMonthLimit,
            hasDailyWithdrawLimit: result.HasMaxWithdrawPerDayLimit,
            hasWeeklyWithdrawLimit: result.HasMaxWithdrawPerWeekLimit,
            hasMonthlyWithdrawLimit: result.HasMaxWithdrawPerMonthLimit,
            hasDailyLossLimit: result.HasDailyLossLimit || false,
            hasWeeklyLossLimit: result.HasWeeklyLossLimit || false,
            hasMonthlyLossLimit: result.HasMonthlyLossLimit || false
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, response]);

  const fetchUserDetails = async () => {
    setDetailLoading(true);
    const result = await PlayerService.userDetail(playerId);
    let details = null;

    if (result && result.status === 200) {
      details = result.response.data;
    }
    setDetailLoading(false);
    return details;
  };

  const updatePlayerLimit = async (requestObject) => {
    setLoading(true);
    setError(null);

    console.log('requestObject: ', requestObject);
    const result = await PlayerService.updateUserLimit(requestObject, playerId);
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
    console.log('useEffect 2 called');
    if (!loading && !error && response) {
      toast.success(response.message);
      // setResponse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handlePlayerLimitUpdate = async (data) => {
    await updatePlayerLimit(data);
  };

  const handleChangeExclusionType = (field, val) => {
    field.onChange(val.value);
    setExclusionType(val.value);
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handlePlayerLimitUpdate)}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {/* Simple Box */}
            {detailLoading ? (
              [...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-100 w-full rounded-lg bg-white px-4 py-4 sm:px-5" />
              ))
            ) : (
              <>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('dailyWagerLimit')}
                    </h2>
                    <Switch {...register('hasDailyWagerLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          id="dailyWagerLimit"
                          {...register('dailyWagerLimit')}
                          error={errors?.dailyWagerLimit?.message}
                          placeholder="Enter Daily Wager Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('weeklyWagerLimit')}
                    </h2>

                    <Switch {...register('hasWeeklyWagerLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('weeklyWagerLimit')}
                          error={errors?.weeklyWagerLimit?.message}
                          id="weeklyWagerLimit"
                          placeholder="Enter Weekly Wager Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('monthlyWagerLimit')}
                    </h2>

                    <Switch {...register('hasMonthlyWagerLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('monthlyWagerLimit')}
                          error={errors?.monthlyWagerLimit?.message}
                          id="monthlyWagerLimit"
                          placeholder="Enter Monthly Wager Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('dailyDepositLimit')}
                    </h2>
                    <Switch {...register('hasDailyDepositLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('dailyDepositLimit')}
                          error={errors?.dailyDepositLimit?.message}
                          id="dailyDepositLimit"
                          placeholder="Enter Daily Deposit Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('weeklyDepositLimit')}
                    </h2>
                    <Switch {...register('hasWeeklyDepositLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('weeklyDepositLimit')}
                          error={errors?.weeklyDepositLimit?.message}
                          id="weeklyDepositLimit"
                          placeholder="Enter Weekly Deposit Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('monthlyDepositLimit')}
                    </h2>
                    <Switch {...register('hasMonthlyDepositLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('monthlyDepositLimit')}
                          error={errors?.monthlyDepositLimit?.message}
                          id="monthlyDepositLimit"
                          placeholder="Enter Monthly Deposit Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('dailyWithdrawLimit')}
                    </h2>
                    <Switch {...register('hasDailyWithdrawLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('dailyWithdrawLimit')}
                          error={errors?.dailyWithdrawLimit?.message}
                          id="dailyWithdrawLimit"
                          placeholder="Enter Daily Withdraw Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('weeklyWithdrawLimit')}
                    </h2>
                    <Switch {...register('hasWeeklyWithdrawLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('weeklyWithdrawLimit')}
                          error={errors?.weeklyWithdrawLimit?.message}
                          id="weeklyWithdrawLimit"
                          placeholder="Enter Weekly Withdraw Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('monthlyWithdrawLimit')}
                    </h2>
                    <Switch {...register('hasMonthlyWithdrawLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('monthlyWithdrawLimit')}
                          error={errors?.monthlyWithdrawLimit?.message}
                          id="monthlyWithdrawLimit"
                          placeholder="Enter Monthly Withdraw Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                        {t('dailyLossLimit')}
                      </h2>
                      <ContextualHelp
                        title="What is a Contextual help ?"
                        content={
                          <p>
                            Contextual help shows a user extra information about the state of an
                            adjacent component, or a total view.
                          </p>
                        }
                      />
                    </div>
                    <Switch {...register('hasDailyLossLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('dailyLossLimit')}
                          error={errors?.dailyLossLimit?.message}
                          id="dailyLossLimit"
                          placeholder="Enter Daily Loss Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('weeklyLossLimit')}
                    </h2>
                    <Switch {...register('hasWeeklyLossLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          {...register('weeklyLossLimit')}
                          error={errors?.weeklyLossLimit?.message}
                          id="weeklyLossLimit"
                          placeholder="Enter Weekly Loss Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('monthlyLossLimit')}
                    </h2>
                    <Switch {...register('hasMonthlyLossLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          type="number"
                          {...register('monthlyLossLimit')}
                          error={errors?.monthlyLossLimit?.message}
                          id="monthlyLossLimit"
                          placeholder="Enter Monthly Loss Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('oneTimeBetLimit')}
                    </h2>
                    <Switch {...register('hasOneTimeBetLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          type="number"
                          {...register('oneTimeBetLimit')}
                          error={errors?.oneTimeBetLimit?.message}
                          id="oneTimeBetLimit"
                          placeholder="Enter One Time Bet Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                      {t('oneTimeWinLimit')}
                    </h2>
                    <Switch {...register('hasOneTimeWinLimit')} label="" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Input
                          type="number"
                          {...register('oneTimeWinLimit')}
                          error={errors?.oneTimeWinLimit?.message}
                          id="oneTimeWinLimit"
                          placeholder="Enter One Time Win Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Box>
                <div>
                  <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                    <div>
                      <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                        {t('selfExclusionTime')}
                      </h2>
                    </div>
                    <div className="pt-2">
                      <div className="max-w-xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Controller
                            render={({ field }) => (
                              <Listbox
                                data={exclusionTimeOptions}
                                value={
                                  exclusionTimeOptions.find(
                                    (exclusionTime) => +exclusionTime.value === +field.value
                                  ) || null
                                }
                                onChange={(val) => handleChangeExclusionType(field, val)}
                                name={field.name}
                                placeholder={
                                  t('select') +
                                  ' ' +
                                  t('self') +
                                  ' ' +
                                  t('exclusion') +
                                  ' ' +
                                  t('type')
                                }
                                displayField="label"
                                error={errors?.selfExclusionType?.message}
                              />
                            )}
                            control={control}
                            name="selfExclusionType"
                          />
                        </div>

                        <div>
                          {+exclusionType === 6 && (
                            <div className="flex flex-wrap gap-2 pt-1.5">
                              <Controller
                                render={({ field: { onChange, value, ...rest } }) => (
                                  <DatePicker
                                    onChange={onChange}
                                    value={value || ''}
                                    label={t('exclusion') + ' ' + t('startAt')}
                                    error={errors?.exclusionStartAt?.message}
                                    options={{
                                      disableMobile: true,
                                      enableTime: true,
                                      time_24hr: true
                                    }}
                                    placeholder="Choose date..."
                                    {...rest}
                                  />
                                )}
                                control={control}
                                name="exclusionStartAt"
                              />
                              <Controller
                                render={({ field: { onChange, value, ...rest } }) => (
                                  <DatePicker
                                    onChange={onChange}
                                    value={value || ''}
                                    label={t('exclusion') + ' ' + t('endAt')}
                                    error={errors?.exclusionEndAt?.message}
                                    options={{
                                      disableMobile: true,
                                      enableTime: true,
                                      time_24hr: true
                                    }}
                                    placeholder="Choose date..."
                                    {...rest}
                                  />
                                )}
                                control={control}
                                name="exclusionEndAt"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Box>
                </div>
              </>
            )}
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

export default PlayerLimit;
