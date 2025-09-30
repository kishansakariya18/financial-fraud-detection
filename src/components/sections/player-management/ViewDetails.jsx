// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Skeleton } from 'components/ui';
import { Chart } from 'components/custom/Chart';
import { Link, useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { playerStatusToApp } from './helper';
import { mapLimitSummary } from 'app/pages/Auth/schema';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import PlayerService from 'services/player.services';
// import { showImage } from 'utils/showImage';
import { useTranslation } from 'react-i18next';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { toast } from 'sonner';
import RenderImage from 'components/ui/custom/ImageRender';
import apiConfig from 'configs/api.config';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export function ViewDetails({
  isAgent = false,
  playerId: initialPlayerId = null,
  customBreadcrumbs = null,
  agentUID = null
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [userSummary, setUserSummary] = useState(null);
  const [limitSummary, setLimitSummary] = useState({
    userLimits: [],
    adminLimits: [],
    userClassLimits: [],
    globalPlatformLimits: null
  });
  const [sectionsOpen, setSectionsOpen] = useState({
    user: true,
    admin: true,
    userClass: false,
    global: true
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const { copied, copy } = useClipboard({ timeout: 2000 });

  // Use props or URL params
  const playerId = initialPlayerId || params.playerId;

  const pageTitle = t('player') + ' ' + t('details');

  const fetchPlayerDetails = async () => {
    setLoading(true);
    const result = await PlayerService.userDetail(playerId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchLimitSummary = async (userID) => {
    try {
      if (!userID) return;
      const result = await PlayerService.getLimitSummary(userID, agentUID);
      if (result?.status === 200) {
        const payload = result?.response?.data;
        const mapped = mapLimitSummary(payload?.data || payload?.Data || payload);
        setLimitSummary(mapped);
      }
    } catch (e) {
      console.error('Error fetching limit summary:', e);
    }
  };

  const fetchUserSummary = async (userID) => {
    try {
      if (!userID) return;
      const summaryResult = await PlayerService.getUserSummary(userID);
      if (summaryResult.status === 200) {
        setUserSummary(summaryResult.response.data);
      }
    } catch (error) {
      console.error('Error fetching user summary:', error);
    }
  };

  useEffect(() => {
    fetchPlayerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  // After user detail is fetched, use numeric UserID for summary and limit APIs
  useEffect(() => {
    const userID = response?.UserID || response?.ID || response?.userID;
    if (userID) {
      fetchUserSummary(userID);
      fetchLimitSummary(userID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.UserID]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  const defaultBreadcrumbs = [
    {
      title: t('players'),
      path: isAgent ? '/calling-agents/assigned-players' : '/users/player'
    },
    { title: t('details') }
  ];

  const breadcrumbItem = customBreadcrumbs || defaultBreadcrumbs;

  // Chart for Profit/Loss breakdown
  const getProfitLossChartData = () => {
    if (!userSummary?.ProfitLoss) return null;

    const { PlatformProfit, TotalWagered, TotalPayout } = userSummary.ProfitLoss;
    const total = PlatformProfit + TotalWagered + TotalPayout;

    if (total === 0) return null;

    return {
      type: 'pie',
      height: 300,
      series: [PlatformProfit, TotalWagered, TotalPayout],
      options: {
        chart: {
          type: 'pie',
          toolbar: {
            show: false
          }
        },
        labels: [t('platformProfit'), t('totalWagered'), t('totalPayout')],
        legend: {
          position: 'bottom',
          fontSize: '12px',
          fontFamily: 'inherit',
          labels: {
            colors: '#000000'
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return `${value}`;
            }
          }
        },
        plotOptions: {
          pie: {
            customScale: 1
          }
        },
        stroke: {
          colors: ['#fff'],
          width: 0
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 0.1
            }
          }
        }
      }
    };
  };

  // Chart for Transaction Counts
  const getTransactionCountsChartData = () => {
    if (!userSummary?.TransactionCounts) return null;

    const { CasinoWageredCount, SportsWageredCount, DepositCount } = userSummary.TransactionCounts;
    const total = CasinoWageredCount + SportsWageredCount + DepositCount;

    if (total === 0) return null;

    return {
      type: 'pie',
      height: 300,
      series: [CasinoWageredCount, SportsWageredCount, DepositCount],
      options: {
        chart: {
          type: 'pie',
          toolbar: {
            show: false
          }
        },
        labels: [t('casinoWageredCount'), t('sportsWageredCount'), t('depositCount')],
        legend: {
          position: 'bottom',
          fontSize: '12px',
          fontFamily: 'inherit',
          labels: {
            colors: '#374151'
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return `${value} ${t('transactions')}`;
            }
          }
        },
        plotOptions: {
          pie: {
            customScale: 1
          }
        },
        stroke: {
          colors: ['#fff'],
          width: 0
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 0.1
            }
          }
        }
      }
    };
  };

  // Chart for Game Transactions
  const getGameTransactionsChartData = () => {
    if (!userSummary?.GameTransactions) return null;

    const { CasinoWagered, SportsWagered, CasinoPayout, SportsPayout } =
      userSummary.GameTransactions;
    const total = CasinoWagered + SportsWagered + CasinoPayout + SportsPayout;

    if (total === 0) return null;

    return {
      type: 'pie',
      height: 300,
      series: [CasinoWagered, SportsWagered, CasinoPayout, SportsPayout],
      options: {
        chart: {
          type: 'pie',
          toolbar: {
            show: false
          }
        },
        labels: [t('casinoWagered'), t('sportsWagered'), t('casinoPayout'), t('sportsPayout')],
        legend: {
          position: 'bottom',
          fontSize: '12px',
          fontFamily: 'inherit',
          labels: {
            colors: '#374151'
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return `${value}`;
            }
          }
        },
        plotOptions: {
          pie: {
            customScale: 1
          }
        },
        stroke: {
          colors: ['#fff'],
          width: 0
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 0.1
            }
          }
        }
      }
    };
  };

  // Chart for Banking Transactions
  const getBankingTransactionsChartData = () => {
    if (!userSummary?.BankingTransactions) return null;

    const { Deposit, Withdraw } = userSummary.BankingTransactions;
    const total = Deposit + Withdraw;

    if (total === 0) return null;

    return {
      type: 'pie',
      height: 300,
      series: [Deposit, Withdraw],
      options: {
        chart: {
          type: 'pie',
          toolbar: {
            show: false
          }
        },
        labels: [t('deposit'), t('withdraw')],
        legend: {
          position: 'bottom',
          fontSize: '12px',
          fontFamily: 'inherit',
          labels: {
            colors: '#374151'
          }
        },
        dataLabels: {
          enabled: false,
          formatter: function (val, opts) {
            const value = opts.w.globals.series[opts.seriesIndex];
            const percentage = val.toFixed(1);
            return `${percentage}%\n(${value})`;
          },
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: '400',
            colors: ['#000000', '#000000']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            color: '#ffffff',
            opacity: 0.1
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return `${value}`;
            }
          }
        },
        plotOptions: {
          pie: {
            customScale: 1
          }
        },
        stroke: {
          colors: ['#fff'],
          width: 0
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 0.1
            }
          }
        }
      }
    };
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex w-full items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
            ))
          ) : (
            <>
              <Card className="h-350 p-4 sm:p-5">
                {(getProfitLossChartData() ||
                  getTransactionCountsChartData() ||
                  getGameTransactionsChartData() ||
                  getBankingTransactionsChartData()) && (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {getProfitLossChartData() && (
                      <Chart data={getProfitLossChartData()} title={t('profitLossReport')} />
                    )}
                    {getTransactionCountsChartData() && (
                      <Chart
                        data={getTransactionCountsChartData()}
                        title={t('transactionCounts')}
                      />
                    )}
                    {getGameTransactionsChartData() && (
                      <Chart data={getGameTransactionsChartData()} title={t('gameTransactions')} />
                    )}
                    {getBankingTransactionsChartData() && (
                      <Chart
                        data={getBankingTransactionsChartData()}
                        title={t('bankingTransactions')}
                      />
                    )}
                  </div>
                )}
                <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                  {t('player') + ' ' + t('information')}
                </h6>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('userUid')}
                    </p>
                    <p>{response?.UserUID}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('userName')}
                    </p>
                    <p>{response?.Username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('firstName')}
                    </p>
                    <p>{response?.FirstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('lastName')}
                    </p>
                    <p>{response?.LastName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('email')}
                    </p>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span> {response?.Email || '-'}</span>
                      {response.Email && (
                        <Button
                          data-tooltip
                          data-tooltip-content={copied ? 'Copied' : 'Copy'}
                          onClick={() => copy(response?.Email)}
                          isIcon
                          variant="flat"
                          className="size-5 rounded-full group-hover/td:opacity-100"
                          aria-label="Copy Button">
                          <DocumentDuplicateIcon className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('mobile')}
                    </p>

                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span>
                        {response?.dialCode || '+91'} {response?.Mobile}
                      </span>
                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(response?.Mobile)}
                        isIcon
                        variant="flat"
                        className="size-5 rounded-full group-hover/td:opacity-100"
                        aria-label="Copy Button">
                        <DocumentDuplicateIcon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {/* <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('realCash')}
                    </p>
                    <p>{response?.RealCash || '0'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('bonus')}
                    </p>
                    <p>{response?.Bonus || '0'}</p>
                  </div> */}

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('status')}
                    </p>
                    <p>
                      {+response.AccountStatus >= 0 &&
                        capitalizeFirstLetter(playerStatusToApp(+response?.AccountStatus))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('gender')}
                    </p>
                    <p>{response?.Gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">DOB:</p>
                    <p>{response?.DOB || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('address')}
                    </p>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span>{response?.Address || '-'}</span>
                      {response.Address && (
                        <Button
                          data-tooltip
                          data-tooltip-content={copied ? 'Copied' : 'Copy'}
                          onClick={() => copy(response?.Address)}
                          isIcon
                          variant="flat"
                          className="size-5 rounded-full group-hover/td:opacity-100"
                          aria-label="Copy Button">
                          <DocumentDuplicateIcon className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('referralCode')}
                    </p>

                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <span>{response?.ReferralCode}</span>

                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(response?.ReferralCode)}
                        isIcon
                        variant="flat"
                        className="size-5 rounded-full group-hover/td:opacity-100"
                        aria-label="Copy Button">
                        <DocumentDuplicateIcon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('signupIpAddress')}
                    </p>

                    {response?.SignupIPAddress ? (
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <span>{response?.SignupIPAddress}</span>

                        <Button
                          data-tooltip
                          data-tooltip-content={copied ? 'Copied' : 'Copy'}
                          onClick={() => copy(response?.SignupIPAddress)}
                          isIcon
                          variant="flat"
                          className="size-5 rounded-full group-hover/td:opacity-100"
                          aria-label="Copy Button">
                          <DocumentDuplicateIcon className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('createdAt')}:
                    </p>
                    <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {`${t('userBlockedAt')}`}
                    </p>
                    <p>
                      {response?.UserBlockedAt
                        ? getDateInUTCToTimeZone(response?.UserBlockedAt)
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('image') + ' ' + t('preview')}
                    </p>
                    <div className="mt-2">
                      {/* {response?.ImageName && showImage('user', response?.ImageName)} */}
                      {response?.ImageName && (
                        <RenderImage
                          value={`${apiConfig.baseURL.S3_URL}/user/${response?.ImageName}`}
                          id={'gameImage'}
                        />
                      )}
                      {response?.ImageName}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('last_login_ip')}
                    </p>
                    <p>{response?.LastLoginIP || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('lastLoginAt')}
                    </p>
                    <p>{getDateInUTCToTimeZone(response?.LastLoginAt) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('loginCount')}
                    </p>
                    <p>{response?.LoginCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('country')}
                    </p>
                    <p>{response?.country?.CountryName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('pan') + ' ' + t('status')}
                    </p>
                    <p>
                      {response?.PanDetail !== null &&
                      (response?.IsKYCVerified === 1 || response?.IsKYCVerified === true)
                        ? `${response.PanDetail} (Verified)`
                        : `Pending`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('bank') + ' ' + t('status')}
                    </p>
                    <p>
                      {response?.BankDetail !== null &&
                      (response?.IsBankVerified === 1 || response?.IsBankVerified === true)
                        ? `${response.BankDetail} (Verified)`
                        : `Pending`}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('affiliate')}
                    </p>
                    {response?.affiliate ? (
                      <Link
                        to={`/users/affiliate/${response?.affiliate?.AffiliatesUID}/tab/details`}
                        className="tracking-wide text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500">
                        <p className="text-center">{response?.affiliate?.Username || '-'}</p>
                      </Link>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </Card>

              {/* User Limits Card */}
              <Card className="mt-6 p-4 sm:p-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between pb-2 text-left text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200"
                  onClick={() => setSectionsOpen((s) => ({ ...s, user: !s.user }))}>
                  <span>
                    {t('user')} {t('limit')}
                  </span>
                  {sectionsOpen.user ? (
                    <ChevronUpIcon className="size-7" />
                  ) : (
                    <ChevronDownIcon className="size-7" />
                  )}
                </button>
                {sectionsOpen.user && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {limitSummary.userLimits.length === 0 ? (
                      <p className="col-span-3 text-sm text-gray-600">{t('noData')}</p>
                    ) : (
                      limitSummary.userLimits.reduce((acc, l) => {
                        acc.push(
                          <div key={`u-${l.id}-limit`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('limit')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? t('yes') : t('no')}</p>
                          </div>
                        );
                        acc.push(
                          <div key={`u-${l.id}-value`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('value')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? l.amount : '-'}</p>
                          </div>
                        );
                        return acc;
                      }, [])
                    )}
                  </div>
                )}
              </Card>

              {/* Admin Limits Card */}
              <Card className="mt-6 p-4 sm:p-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between pb-2 text-left text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200"
                  onClick={() => setSectionsOpen((s) => ({ ...s, admin: !s.admin }))}>
                  <span>
                    {t('admin')} {t('limit')}
                  </span>
                  {sectionsOpen.admin ? (
                    <ChevronUpIcon className="size-7" />
                  ) : (
                    <ChevronDownIcon className="size-7" />
                  )}
                </button>
                {sectionsOpen.admin && (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {limitSummary.adminLimits.length === 0 ? (
                      <p className="col-span-3 text-sm text-gray-600">{t('noData')}</p>
                    ) : (
                      limitSummary.adminLimits.reduce((acc, l) => {
                        acc.push(
                          <div key={`a-${l.id}-limit`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('limit')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? t('yes') : t('no')}</p>
                          </div>
                        );
                        acc.push(
                          <div key={`a-${l.id}-value`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('value')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? l.amount : '-'}</p>
                          </div>
                        );
                        return acc;
                      }, [])
                    )}
                  </div>
                )}
              </Card>

              {/* User Class Limits Card */}
              <Card className="mt-6 p-4 sm:p-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between pb-2 text-left text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200"
                  onClick={() => setSectionsOpen((s) => ({ ...s, userClass: !s.userClass }))}>
                  <span>
                    {t('user')} {t('class')} {t('limit')}
                  </span>
                  {sectionsOpen.userClass ? (
                    <ChevronUpIcon className="size-7" />
                  ) : (
                    <ChevronDownIcon className="size-7" />
                  )}
                </button>
                {sectionsOpen.userClass && (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {limitSummary.userClassLimits.length === 0 ? (
                      <p className="col-span-3 text-sm text-gray-600">{t('noData')}</p>
                    ) : (
                      limitSummary.userClassLimits.reduce((acc, l) => {
                        acc.push(
                          <div key={`uc-${l.id}-limit`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('limit')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? t('yes') : t('no')}</p>
                          </div>
                        );
                        acc.push(
                          <div key={`uc-${l.id}-value`}>
                            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                              {`${capitalizeFirstLetter(l.type)} ${capitalizeFirstLetter(l.period)} ${t('value')}`}
                            </p>
                            <p>{(Number(l.amount) || 0) > 0 ? l.amount : '-'}</p>
                          </div>
                        );
                        return acc;
                      }, [])
                    )}
                  </div>
                )}
              </Card>

              {/* Global Platform Limits Card */}
              <Card className="mt-6 p-4 sm:p-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between pb-2 text-left text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200"
                  onClick={() => setSectionsOpen((s) => ({ ...s, global: !s.global }))}>
                  <span>
                    {t('global')} {t('platform')} {t('limit')}
                  </span>
                  {sectionsOpen.global ? (
                    <ChevronUpIcon className="size-7" />
                  ) : (
                    <ChevronDownIcon className="size-7" />
                  )}
                </button>
                {sectionsOpen.global && (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {!limitSummary.globalPlatformLimits ? (
                      <p className="col-span-3 text-sm text-gray-600">{t('noData')}</p>
                    ) : (
                      <>
                        {/* Daily Deposit */}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('dailyDepositLimit')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.maxDepositPerDay) || 0) > 0
                              ? t('yes')
                              : t('no')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('dailyDepositValue')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.maxDepositPerDay) || 0) > 0
                              ? limitSummary.globalPlatformLimits.maxDepositPerDay
                              : '-'}
                          </p>
                        </div>

                        {/* Daily Withdraw */}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('dailyWithdrawLimit')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.maxWithdrawPerDay) || 0) > 0
                              ? t('yes')
                              : t('no')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('dailyWithdrawValue')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.maxWithdrawPerDay) || 0) > 0
                              ? limitSummary.globalPlatformLimits.maxWithdrawPerDay
                              : '-'}
                          </p>
                        </div>

                        {/* One Time Bet */}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('oneTimeBetLimit')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.betLimit) || 0) > 0
                              ? t('yes')
                              : t('no')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('oneTimeBetValue')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.betLimit) || 0) > 0
                              ? limitSummary.globalPlatformLimits.betLimit
                              : '-'}
                          </p>
                        </div>

                        {/* One Time Win */}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('oneTimeWinLimit')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.winLimit) || 0) > 0
                              ? t('yes')
                              : t('no')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                            {`${t('oneTimeWinValue')}`}
                          </p>
                          <p>
                            {(Number(limitSummary.globalPlatformLimits.winLimit) || 0) > 0
                              ? limitSummary.globalPlatformLimits.winLimit
                              : '-'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
              <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  className="min-w-[7rem]"
                  onClick={() =>
                    isAgent
                      ? navigate('/calling-agents/assigned-players')
                      : navigate('/users/player')
                  }>
                  {t('back')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
