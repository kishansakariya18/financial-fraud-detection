// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from 'react';

// Local Imports
import {
  Button,
  GhostSpinner,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'components/ui';
import { Page } from 'components/shared/Page';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import PlayerService from 'services/player.services';
import { useTranslation } from 'react-i18next';
import { transactionStatusToAPP } from '../helper';

export function ViewDetails({ transactionId, onClose }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const pageTitle = t('player') + ' ' + t('details');

  const fetchPlayerDetails = useCallback(async () => {
    setLoading(true);
    const result = await PlayerService.playerTransactionDetail({
      transactionId,
    });

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [transactionId]);

  useEffect(() => {
    fetchPlayerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const headers = [t('currency'), t('opening'), t('current'), t('closing')]; // Define headers

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('information')}
          </h6>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('transaction') + 'UID'}
              </p>
              <p>{response?.TransactionUID}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('user') + 'ID'}
              </p>
              <p>{response?.UserID || 'not-provide'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('realCash')}
              </p>
              <p>{response?.RealCashAmount || '0'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('status')}
              </p>
              <p>
                {response?.Status >= 0 &&
                  transactionStatusToAPP(response.Status)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('createdAt')}:
              </p>
              <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  {headers.map((header, index) => (
                    <Th
                      key={index}
                      className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </THead>

              <TBody>
                {/* Static Rows */}
                <Tr className="bg-gray-100 font-semibold text-gray-900 dark:bg-dark-700 dark:text-white">
                  <Td key={0}>{t('realCash')}</Td>
                  <Td key={1} className={'text-center'}>
                    {' '}
                    {response?.OpeningRealCashAmount}
                  </Td>
                  <Td key={2} className={'text-center'}>
                    {+response?.Type === 1 && response?.RealCashAmount > 0 ? (
                      <span className={'text-error dark:text-error-light'}>
                        {' '}
                        - {response?.RealCashAmount}{' '}
                      </span>
                    ) : (
                      <span className="text-success dark:text-success-light">
                        {' '}
                        {response?.RealCashAmount}{' '}
                      </span>
                    )}
                  </Td>
                  <Td key={3} className={'text-center'}>
                    {response?.TotalRealCashAmount}
                  </Td>
                </Tr>
                <Tr className="bg-gray-100 font-semibold text-gray-900 dark:bg-dark-700 dark:text-white">
                  <Td key={0}>{t('bonus')}</Td>
                  <Td key={1} className={'text-center'}>
                    {response?.OpeningBonus}
                  </Td>
                  <Td key={2} className={'text-center'}>
                    {+response?.Type === 1 && response.Bonus > 0 ? (
                      <span className="text-error dark:text-error-light">
                        {' '}
                        - {response?.Bonus}{' '}
                      </span>
                    ) : (
                      <span className="text-success dark:text-success-light">
                        {' '}
                        {response?.Bonus}{' '}
                      </span>
                    )}
                  </Td>
                  <Td key={3} className={'text-center'}>
                    {response?.TotalBonus}
                  </Td>
                </Tr>
              </TBody>
            </Table>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={onClose}>
              {t('back')}
            </Button>
            {loading && <GhostSpinner className="size-4 border-2" />}
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </Page>
  );
}
