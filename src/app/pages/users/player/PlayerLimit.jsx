// Local Imports
import { Box, Button, Input, Skeleton, Switch } from 'components/ui';
import { Page } from 'components/shared/Page';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import PlayerService from 'services/player.services';
import { ContextualHelp } from 'components/shared/ContextualHelp';
import { playerLimitSchema } from './schema';
// import { Listbox } from 'components/shared/form/Listbox';
// import { DatePicker } from 'components/shared/form/Datepicker';
// import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

// const exclusionTimeOptions = [
//   { label: '1 day', value: 1 },
//   { label: '7 day', value: 2 },
//   { label: '1 month', value: 3 },
//   { label: '6 month', value: 4 },
//   { label: '12 month', value: 5 },
//   { label: 'Custom', value: 6 },
//   { label: 'Permenent', value: 7 }
// ];

const PlayerLimit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { playerId } = useParams();
  const [userId, setUserId] = useState(null); // numeric user ID
  // const [exclusionType, setExclusionType] = useState('');
  const [limitIdMap, setLimitIdMap] = useState({});
  const [limitsData, setLimitsData] = useState([]); // API-driven limits for dynamic UI
  const { t } = useTranslation();
  const pageTitle = t('player') + ' ' + t('limit');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(playerLimitSchema)
  });

  useEffect(() => {
    if (playerId) {
      // Resolve numeric user ID from UID first, then fetch limits
      resolveUserId().then((resolvedId) => {
        if (!resolvedId) return;
        fetchUserDetails(resolvedId).then((list) => {
          if (Array.isArray(list)) {
            // Build ID map and form defaults
            const map = {};
            const get = (type, period) =>
              list.find((x) => x.limitType === type && x.limitPeriod === period);
            const depD = get('deposit', 'daily');
            const depW = get('deposit', 'weekly');
            const depM = get('deposit', 'monthly');
            const wdrD = get('withdraw', 'daily');
            const wdrW = get('withdraw', 'weekly');
            const wdrM = get('withdraw', 'monthly');
            const wagO = get('wager', 'one-time');
            const wagD = get('wager', 'daily');
            const wagW = get('wager', 'weekly');
            const wagM = get('wager', 'monthly');
            const losD = get('loss', 'daily');
            const losW = get('loss', 'weekly');
            const losM = get('loss', 'monthly');

            const setEntry = (obj) => {
              if (!obj) return;
              map[`${obj.limitType}_${obj.limitPeriod}`] = obj.id;
            };
            [depD, depW, depM, wdrD, wdrW, wdrM, wagO, wagD, wagW, wagM, losD, losW, losM].forEach(
              setEntry
            );
            setLimitIdMap(map);

            const amt = (x) => Number(x?.limitAmount || 0);
            const ap = (x) => Boolean(x?.isApply);
            const on = (x) => ap(x) && amt(x) > 0;

            reset({
              dailyWagerLimit: amt(wagD),
              weeklyWagerLimit: amt(wagW),
              monthlyWagerLimit: amt(wagM),
              oneTimeWagerLimit: amt(wagO),
              dailyDepositLimit: amt(depD),
              weeklyDepositLimit: amt(depW),
              monthlyDepositLimit: amt(depM),
              dailyWithdrawLimit: amt(wdrD),
              weeklyWithdrawLimit: amt(wdrW),
              monthlyWithdrawLimit: amt(wdrM),
              dailyLossLimit: amt(losD),
              weeklyLossLimit: amt(losW),
              monthlyLossLimit: amt(losM),

              // Flags forced false if amount not > 0
              hasOneTimeWagerLimit: on(wagO),
              hasDailyWagerLimit: on(wagD),
              hasWeeklyWagerLimit: on(wagW),
              hasMonthlyWagerLimit: on(wagM),
              hasDailyDepositLimit: on(depD),
              hasWeeklyDepositLimit: on(depW),
              hasMonthlyDepositLimit: on(depM),
              hasDailyWithdrawLimit: on(wdrD),
              hasWeeklyWithdrawLimit: on(wdrW),
              hasMonthlyWithdrawLimit: on(wdrM),
              hasDailyLossLimit: on(losD),
              hasWeeklyLossLimit: on(losW),
              hasMonthlyLossLimit: on(losM)
            });
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, response]);

  // Get numeric user ID from UID using user detail API
  const resolveUserId = async () => {
    try {
      const res = await PlayerService.userDetail(playerId);
      if (res && res.status === 200) {
        const data = res.response?.data || {};
        // Handle various possible API shapes/keys
        const id = data?.UserID ?? null;
        if (id) {
          setUserId(id);
          return id;
        }
      }
    } catch {
      // noop
    }
    return null;
  };

  const fetchUserDetails = async (resolvedUserId) => {
    setDetailLoading(true);
    const targetUserId = resolvedUserId ?? userId;
    const result = await PlayerService.getUserAllLimits(targetUserId);
    let details = null;
    if (result && result.status === 200) {
      details = result.response.data;
    }
    // Store for dynamic rendering
    setLimitsData(Array.isArray(details) ? details : []);
    setDetailLoading(false);
    return details;
  };

  const updatePlayerLimit = async (requestObject) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure we have numeric userId
      let targetUserId = userId;
      if (!targetUserId) {
        targetUserId = await resolveUserId();
        if (!targetUserId) {
          setError('Unable to resolve user ID');
          return;
        }
      }
      // Build bulk limits payload from form values and stored IDs
      const limits = [
        {
          limitType: 'deposit',
          limitPeriod: 'daily',
          valueKey: 'dailyDepositLimit',
          flagKey: 'hasDailyDepositLimit'
        },
        {
          limitType: 'deposit',
          limitPeriod: 'weekly',
          valueKey: 'weeklyDepositLimit',
          flagKey: 'hasWeeklyDepositLimit'
        },
        {
          limitType: 'deposit',
          limitPeriod: 'monthly',
          valueKey: 'monthlyDepositLimit',
          flagKey: 'hasMonthlyDepositLimit'
        },
        {
          limitType: 'withdraw',
          limitPeriod: 'daily',
          valueKey: 'dailyWithdrawLimit',
          flagKey: 'hasDailyWithdrawLimit'
        },
        {
          limitType: 'withdraw',
          limitPeriod: 'weekly',
          valueKey: 'weeklyWithdrawLimit',
          flagKey: 'hasWeeklyWithdrawLimit'
        },
        {
          limitType: 'withdraw',
          limitPeriod: 'monthly',
          valueKey: 'monthlyWithdrawLimit',
          flagKey: 'hasMonthlyWithdrawLimit'
        },
        {
          limitType: 'wager',
          limitPeriod: 'one-time',
          valueKey: 'oneTimeWagerLimit',
          flagKey: 'hasOneTimeWagerLimit'
        },
        {
          limitType: 'wager',
          limitPeriod: 'daily',
          valueKey: 'dailyWagerLimit',
          flagKey: 'hasDailyWagerLimit'
        },
        {
          limitType: 'wager',
          limitPeriod: 'weekly',
          valueKey: 'weeklyWagerLimit',
          flagKey: 'hasWeeklyWagerLimit'
        },
        {
          limitType: 'wager',
          limitPeriod: 'monthly',
          valueKey: 'monthlyWagerLimit',
          flagKey: 'hasMonthlyWagerLimit'
        },
        {
          limitType: 'loss',
          limitPeriod: 'daily',
          valueKey: 'dailyLossLimit',
          flagKey: 'hasDailyLossLimit'
        },
        {
          limitType: 'loss',
          limitPeriod: 'weekly',
          valueKey: 'weeklyLossLimit',
          flagKey: 'hasWeeklyLossLimit'
        },
        {
          limitType: 'loss',
          limitPeriod: 'monthly',
          valueKey: 'monthlyLossLimit',
          flagKey: 'hasMonthlyLossLimit'
        }
      ].map((item) => ({
        id: limitIdMap[`${item.limitType}_${item.limitPeriod}`] ?? null,
        limitType: item.limitType,
        limitPeriod: item.limitPeriod,
        limitAmount: Number(requestObject[item.valueKey] || 0),
        isApply: !!requestObject[item.flagKey]
      }));

      const result = await PlayerService.bulkUpdateUserLimits(targetUserId, limits);
      if (result) {
        if (result.status === 200 || result.status === 201) {
          setResponse(result.response);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong while updating limits');
    } finally {
      setLoading(false);
    }
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

  // const handleChangeExclusionType = (field, val) => {
  //   field.onChange(val.value);
  //   setExclusionType(val.value);
  // };
  const breadcrumbItem = [
    { title: t('players'), path: '/users/player' },
    { title: t('player') + ' ' + t('limit') }
  ];

  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <form onSubmit={handleSubmit(handlePlayerLimitUpdate)}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {/* Simple Box */}
            {detailLoading ? (
              [...Array(9)].map((_, i) => (
                <Box
                  key={i}
                  className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                  <div className="mt-1.5 flex items-center justify-between">
                    <Skeleton className="h-5 w-40 rounded bg-gray-200 dark:bg-dark-600" />
                    <Skeleton className="h-6 w-10 rounded bg-gray-200 dark:bg-dark-600" />
                  </div>
                  <div className="pt-2">
                    <div className="max-w-xl">
                      <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                        <Skeleton className="h-10 w-full rounded bg-gray-200 dark:bg-dark-600" />
                      </div>
                    </div>
                  </div>
                </Box>
              ))
            ) : (
              <>
                <>
                  {
                    // Helper functions
                  }
                  {(() => {
                    const typeOrder = ['wager', 'deposit', 'withdraw', 'loss'];
                    const periodOrder = ['one-time', 'daily', 'weekly', 'monthly'];
                    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
                    const mapTypeToKey = (type) => cap(type); // Wager/Deposit/Withdraw/Loss

                    const sorted = [...limitsData]
                      .filter(
                        (x) =>
                          typeOrder.includes(x.limitType) && periodOrder.includes(x.limitPeriod)
                      )
                      .sort((a, b) => {
                        const t = typeOrder.indexOf(a.limitType) - typeOrder.indexOf(b.limitType);
                        if (t !== 0) return t;
                        return (
                          periodOrder.indexOf(a.limitPeriod) - periodOrder.indexOf(b.limitPeriod)
                        );
                      });

                    return sorted.map((item, idx) => {
                      const TypeKey = mapTypeToKey(item.limitType);
                      const PeriodKey = cap(item.limitPeriod);
                      const isOneTimeWager =
                        item.limitType === 'wager' && item.limitPeriod === 'one-time';
                      const valueKey = isOneTimeWager
                        ? 'oneTimeWagerLimit'
                        : `${item.limitPeriod}${TypeKey}Limit`; // e.g., dailyWagerLimit
                      const flagKey = isOneTimeWager
                        ? 'hasOneTimeWagerLimit'
                        : `has${PeriodKey}${TypeKey}Limit`; // e.g., hasDailyWagerLimit
                      // Use camelCase translation keys specifically for one-time wager to avoid any i18n separator issues
                      const titleKey =
                        item.limitType === 'wager' && item.limitPeriod === 'one-time'
                          ? 'oneTimeWagerLimit'
                          : `${item.limitPeriod}${TypeKey}Limit`; // translation key
                      const descKey =
                        item.limitType === 'wager' && item.limitPeriod === 'one-time'
                          ? 'oneTimeWagerLimitDesc'
                          : `${titleKey}Desc`;

                      return (
                        <Box
                          key={`${item.limitType}_${item.limitPeriod}_${idx}`}
                          className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
                          <div className="mt-1.5 flex items-center justify-between">
                            <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                              {t(titleKey)}
                            </h2>
                            <Switch {...register(flagKey)} label="" />
                          </div>
                          <div className="pt-2">
                            <div className="max-w-xl">
                              <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                                <Input
                                  id={valueKey}
                                  {...register(valueKey, { valueAsNumber: true })}
                                  error={errors?.[valueKey]?.message}
                                  placeholder={`Enter ${cap(item.limitPeriod)} ${TypeKey} Limit`}
                                  classNames={{
                                    root: 'flex-1',
                                    input: 'relative rounded-none hover:z-1 focus:z-1'
                                  }}
                                  type="number"
                                  step="any"
                                  suffix={
                                    <ContextualHelp
                                      title={t(titleKey)}
                                      anchor={{ to: 'bottom', gap: 8 }}
                                      content={<p>{t(descKey)}</p>}
                                    />
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </Box>
                      );
                    });
                  })()}
                </>
                {/* <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
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
                          step="any"
                          {...register('oneTimeBetLimit')}
                          error={errors?.oneTimeBetLimit?.message}
                          id="oneTimeBetLimit"
                          placeholder="Enter One Time Bet Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          suffix={
                            <ContextualHelp
                              title={t('oneTimeBetLimit')}
                              anchor={{ to: 'bottom', gap: 8 }}
                              content={<p>{t('oneTimeBetLimitDesc')}</p>}
                            />
                          }
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
                          step="any"
                          {...register('oneTimeWinLimit')}
                          error={errors?.oneTimeWinLimit?.message}
                          id="oneTimeWinLimit"
                          placeholder="Enter One Time Win Limit"
                          classNames={{
                            root: 'flex-1',
                            input: 'relative rounded-none hover:z-1 focus:z-1'
                          }}
                          suffix={
                            <ContextualHelp
                              title={t('oneTimeWinLimit')}
                              anchor={{ to: 'bottom', gap: 8 }}
                              content={<p>{t('oneTimeWinLimitDesc')}</p>}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Box> */}
                <div>
                  {/* <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
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
                  </Box> */}
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
