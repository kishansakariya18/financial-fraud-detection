import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

// Local Imports
import { Card, GhostSpinner } from 'components/ui';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { useCurrencyContext } from 'app/contexts/currency/context';

const SummarySection = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      {/* <p className="font-semibold text-gray-800 dark:text-dark-100">{title}:</p> */}
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
};

const SummaryDataItem = ({ label, value, valueClassName = '' }) => {
  return (
    <div className="min-w-[150px]">
      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{label}</p>
      <p className={`${valueClassName}`}>{value}</p>
    </div>
  );
};

const UserSummaryCard = ({ summaryData, loading }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyContext();

  const formatDate = (date) => {
    if (!date) return '-';
    return getDateInUTCToTimeZone(date);
  };

  const formatBoolean = (value) => {
    if (value === 1 || value === true) return t('yes');
    if (value === 0 || value === false) return t('no');
    return '-';
  };
  // Extract common fields (non-currency specific) - these are the same across all rows
  const commonData = useMemo(() => {
    if (!summaryData || summaryData.length === 0) return null;
    const firstItem = summaryData[0];
    return {
      LastActiveAt: firstItem.LastActiveAt,
      AccountStatus: firstItem.AccountStatus,
      CountryID: firstItem.CountryID,
      IsEmailVerified: firstItem.IsEmailVerified,
      IsMobileVerified: firstItem.IsMobileVerified,
      IsKYCVerified: firstItem.IsKYCVerified,
      LastLoginAt: firstItem.LastLoginAt,
      SignupAt: firstItem.SignupAt,
      AffiliateID: firstItem.AffiliateID
    };
  }, [summaryData]);

  // Calculate ratios and net amount for a currency item
  const calculateMetrics = (item) => {
    const totalDeposits = Number(item.TotalDeposits) || 0;
    const totalWithdrawals = Number(item.TotalWithdrawals) || 0;
    const freeBonusAmount = Number(item.FreeBonusAmount) || 0;
    const depositBonusAmount = Number(item.DepositBonusAmount) || 0;

    // House Net Earnings: Total Deposit - Total Withdrawal Amount
    const netAmount = totalDeposits - totalWithdrawals;

    // Free Bonus %: (Free Bonus Amount / Total Deposits) * 100
    const freeBonusRatio =
      totalDeposits > 0 ? ((freeBonusAmount / totalDeposits) * 100).toFixed(2) : 0;

    // Clean Deposits %: ((Total Deposits - Deposit Bonus Amount) / Total Deposits) * 100
    // Clean Deposits = Total Deposits - Deposit Bonus Amount
    const cleanDepositRatio =
      totalDeposits > 0
        ? (((totalDeposits - depositBonusAmount) / totalDeposits) * 100).toFixed(2)
        : 0;

    // Deposit Bonus %: (Deposit Bonus Amount / Total Deposits) * 100
    const depositBonusRatio =
      totalDeposits > 0 ? ((depositBonusAmount / totalDeposits) * 100).toFixed(2) : 0;

    // Total Bonus %: (Total Bonus Claimed / Total Deposits) * 100
    // Total Bonus Claimed = Free Bonus Amount + Deposit Bonus Amount
    const totalBonusClaimed = freeBonusAmount + depositBonusAmount;
    const totalBonusRatio =
      totalDeposits > 0 ? ((totalBonusClaimed / totalDeposits) * 100).toFixed(2) : 0;

    return {
      netAmount,
      freeBonusRatio,
      cleanDepositRatio,
      depositBonusRatio,
      totalBonusRatio
    };
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-8">
          <GhostSpinner className="size-4 border-2" />
        </div>
      ) : !summaryData || summaryData.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{t('noData')}</p>
      ) : (
        <div className="mt-2 space-y-3">
          {/* Common Information Section */}
          <h6 className="mb-2 text-sm font-semibold text-gray-800 dark:text-dark-200">
            {t('common_information')}
          </h6>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500 dark:bg-dark-700">
            <div className="flex flex-wrap gap-4">
              <SummaryDataItem
                label={t('last_active_at')}
                value={commonData.LastActiveAt ? formatDate(commonData.LastActiveAt) : '-'}
              />
              <SummaryDataItem
                label={t('last_login_at')}
                value={commonData.LastLoginAt ? formatDate(commonData.LastLoginAt) : '-'}
              />
              <SummaryDataItem
                label={t('signup_at')}
                value={commonData.SignupAt ? formatDate(commonData.SignupAt) : '-'}
              />
              <SummaryDataItem
                label={t('account_status')}
                value={commonData.AccountStatus === 1 ? t('active') : t('blocked')}
              />
              <SummaryDataItem
                label={t('email_verified')}
                value={formatBoolean(commonData.IsEmailVerified)}
              />
              <SummaryDataItem
                label={t('mobile_verified')}
                value={formatBoolean(commonData.IsMobileVerified)}
              />
              <SummaryDataItem
                label={t('kyc_verified')}
                value={formatBoolean(commonData.IsKYCVerified)}
              />
              <SummaryDataItem label={t('affiliate_id')} value={commonData.AffiliateID || '-'} />
              <SummaryDataItem label={t('country_id')} value={commonData.CountryID || '-'} />
            </div>
          </div>

          {/* Currency-Specific Data Cards */}
          <div className="">
            <h6 className="mb-2 text-sm font-semibold text-gray-800 dark:text-dark-200">
              {t('currency_specific_data')}
            </h6>
            <div className="overflow-x-auto">
              <div className="flex flex-col gap-3">
                {summaryData.map((item, index) => {
                  const metrics = calculateMetrics(item);
                  return (
                    <Card key={index} className="border border-gray-200 p-3 dark:border-dark-500">
                      {/* Currency Header */}
                      <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-dark-500">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-gray-900 dark:text-white">
                            {item.currency?.code || '-'}
                          </span>
                          {item.currency?.symbol && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              ({item.currency.symbol})
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {item.currency?.name || ''}
                        </span>
                      </div>

                      {/* Currency Data */}
                      <div className="flex flex-wrap gap-2">
                        {/* Betting Data */}
                        <SummarySection title={t('betting')}>
                          <SummaryDataItem
                            label={t('total_bets')}
                            value={formatCurrency(item.TotalBets || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('total_wins')}
                            value={formatCurrency(item.TotalWins || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('total_ggr')}
                            value={formatCurrency(item.TotalGGR || 0, item.currency?.code)}
                          />
                          <SummaryDataItem label={t('bet_count')} value={item.BetCount || 0} />
                          <SummaryDataItem label={t('win_count')} value={item.WinCount || 0} />
                          <SummaryDataItem
                            label={t('average_bet_size')}
                            value={formatCurrency(item.AverageBetSize || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('max_win')}
                            value={formatCurrency(item.MaxWinSingleBet || 0, item.currency?.code)}
                          />
                          {/* </SummarySection> */}

                          {/* Bonus Data */}
                          {/* <SummarySection title={t('bonus')}> */}
                          <SummaryDataItem
                            label={t('bonus_used')}
                            value={formatCurrency(item.TotalBonusUsed || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('bonus_won')}
                            value={formatCurrency(item.TotalBonusWon || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('bonus_count')}
                            value={item.BonusUsedCount || 0}
                          />
                          <SummaryDataItem
                            label={t('free_count')}
                            value={item.FreeBonusCount || 0}
                          />
                          <SummaryDataItem
                            label={t('free_amount')}
                            value={formatCurrency(item.FreeBonusAmount || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('dep_bonus_count')}
                            value={item.DepositBonusCount || 0}
                          />
                          <SummaryDataItem
                            label={t('dep_bonus_amount')}
                            value={formatCurrency(
                              item.DepositBonusAmount || 0,
                              item.currency?.code
                            )}
                          />
                          {/* </SummarySection> */}

                          {/* Transaction Data */}
                          {/* <SummarySection title={t('transactions')}> */}
                          <SummaryDataItem
                            label={t('deposits')}
                            value={formatCurrency(item.TotalDeposits || 0, item.currency?.code)}
                          />
                          <SummaryDataItem
                            label={t('withdrawals')}
                            value={formatCurrency(item.TotalWithdrawals || 0, item.currency?.code)}
                          />
                          <SummaryDataItem label={t('dep_count')} value={item.DepositCount || 0} />
                          <SummaryDataItem
                            label={t('wd_count')}
                            value={item.WithdrawalCount || 0}
                          />
                          {/* </SummarySection>

                        <SummarySection title={t('calculations')}> */}
                          <SummaryDataItem
                            label={t('house_net_earnings')}
                            value={formatCurrency(metrics.netAmount, item.currency?.code)}
                            valueClassName={
                              metrics.netAmount >= 0
                                ? 'text-success dark:text-success-light'
                                : 'text-error dark:text-error-light'
                            }
                          />
                          <SummaryDataItem
                            label={t('free_bonus_ratio')}
                            value={`${metrics.freeBonusRatio}%`}
                          />
                          <SummaryDataItem
                            label={t('clean_deposit_ratio')}
                            value={`${metrics.cleanDepositRatio}%`}
                          />
                          <SummaryDataItem
                            label={t('deposit_bonus_ratio')}
                            value={`${metrics.depositBonusRatio}%`}
                          />
                          <SummaryDataItem
                            label={t('total_bonus_ratio')}
                            value={`${metrics.totalBonusRatio}%`}
                          />
                          {/* </SummarySection> */}

                          {/* Date Information */}

                          {/* <SummarySection title={t('dates')}> */}
                          <SummaryDataItem
                            label={t('first_bet')}
                            value={item.FirstBetAt ? formatDate(item.FirstBetAt) : '-'}
                          />
                          <SummaryDataItem
                            label={t('last_bet')}
                            value={formatDate(item.LastBetAt)}
                          />
                          <SummaryDataItem
                            label={t('first_deposit')}
                            value={formatDate(item.FirstDepositAt)}
                          />
                          <SummaryDataItem
                            label={t('last_deposit')}
                            value={formatDate(item.LastDepositAt)}
                          />
                          <SummaryDataItem
                            label={t('last_bonus')}
                            value={formatDate(item.LastBonusClaimedAt)}
                          />
                        </SummarySection>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

UserSummaryCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

UserSummaryCard.defaultProps = {
  userId: null
};

export default UserSummaryCard;
