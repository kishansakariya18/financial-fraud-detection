import { Table, TBody, Td, Th, THead, Tr } from 'components/ui';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { transactionStatusToAPP } from '../helper';

export function ViewDetails({ transactionData }) {
  const { t } = useTranslation();

  const response = transactionData?._originalData || transactionData;

  const headers = [t('currency'), t('opening'), t('current'), t('closing')]; // Define headers

  return (
    <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-8">
      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
        <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
          {t('information')}
        </h6>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('transaction') + ' UID'}
            </p>
            <p className="text-small break-words">{response?.TransactionUID}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('user') + ' ID'}
            </p>
            <p className="">{response?.UserID || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('transaction') + ' ' + t('type')}
            </p>
            <p className="">{transactionData?.transactionType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('transaction') + ' Amount'}
            </p>
            <p className="">
              {transactionData?.currency?.Symbol && (
                <span className="mr-1 text-xs text-gray-500">
                  {transactionData.currency.Symbol}
                </span>
              )}
              {response?.TransactionAmount || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('currency')}</p>
            <p className="">
              {transactionData?.currency?.name || 'N/A'}
              {transactionData?.currency?.symbol && (
                <span className="ml-1 text-xs text-gray-500">
                  ({transactionData.currency.symbol})
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">Reference ID</p>
            <p className="">{response?.ReferenceID || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('status')}</p>
            <p className="">
              {response?.TransactionStatus >= 0 &&
                capitalizeFirstLetter(transactionStatusToAPP(response.TransactionStatus))}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              Credit/Debit Type
            </p>
            <p className="">{response?.CreditDebitType === 0 ? 'Credit' : 'Debit'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('createdAt')}</p>
            <p className="">{getDateInUTCToTimeZone(response?.DateCreated)}</p>
          </div>
        </div>
        <div className="mt-4">
          <Table hoverable className="w-full text-left rtl:text-right">
            <THead>
              <Tr>
                {headers.map((header, index) => (
                  <Th
                    key={index}
                    className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                    {header}
                  </Th>
                ))}
              </Tr>
            </THead>

            <TBody>
              {/* Currency Balance Row */}
              <Tr className="bg-gray-100 font-semibold text-gray-900 dark:bg-dark-700 dark:text-white">
                <Td key={0}>
                  {transactionData?.currency?.Name || 'Currency'} Balance
                  {transactionData?.currency?.Symbol && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({transactionData.currency.Symbol})
                    </span>
                  )}
                </Td>
                <Td key={1} className={'text-center'}>
                  {response?.OpeningCurrencyBalance || '0'}
                </Td>
                <Td key={2} className={'text-center'}>
                  {+response?.CreditDebitType === 1 && response?.TransactionAmount > 0 ? (
                    <span className={'text-error dark:text-error-light'}>
                      - {response?.TransactionAmount}
                    </span>
                  ) : (
                    <span className="text-success dark:text-success-light">
                      + {response?.TransactionAmount || '0'}
                    </span>
                  )}
                </Td>
                <Td key={3} className={'text-center'}>
                  {response?.ClosingCurrencyBalance || '0'}
                </Td>
              </Tr>
              <Tr className="bg-gray-100 font-semibold text-gray-900 dark:bg-dark-700 dark:text-white">
                <Td key={0}>{t('bonus')}</Td>
                <Td key={1} className={'text-center'}>
                  {response?.OpeningBonus || '0'}
                </Td>
                <Td key={2} className={'text-center'}>
                  {+response?.CreditDebitType === 1 && response?.Bonus > 0 ? (
                    <span className="text-error dark:text-error-light">- {response?.Bonus}</span>
                  ) : (
                    <span className="text-success dark:text-success-light">
                      + {response?.Bonus || '0'}
                    </span>
                  )}
                </Td>
                <Td key={3} className={'text-center'}>
                  {response?.TotalBonus || '0'}
                </Td>
              </Tr>
            </TBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
