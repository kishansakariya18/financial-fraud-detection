// Import Dependencies

// Local Imports
import { Button, Table, TBody, Td, Th, THead, Tr } from 'components/ui';
import { Page } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

export function ViewDetails({ transactionData, onClose }) {
  const { t } = useTranslation();
  const pageTitle = t('transaction') + ' ' + t('details');

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] pb-8">
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('information')}
          </h6>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                Agent Wallet Transaction ID
              </p>
              <p className="font-medium">{transactionData?.agentWalletTransactionID}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('transaction') + ' ' + t('type')}
              </p>
              <p className="font-medium">{transactionData?.transactionType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">Amount</p>
              <p className="font-medium">{transactionData?.amount || '0'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                Credit/Debit Type
              </p>
              <p className="font-medium">{transactionData?.creditDebitType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">Reference ID</p>
              <p className="font-medium">{transactionData?.referenceID || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">Remarks</p>
              <p className="font-medium">{transactionData?.remarks || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('createdAt')}
              </p>
              <p className="font-medium">{transactionData?.createdAt}</p>
            </div>
          </div>
          <div className="mt-4">
            <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              Balance Information
            </h6>
            <Table hoverable className="w-full text-left rtl:text-right">
              <THead>
                <Tr>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                    Balance Type
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                    Opening Balance
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                    Transaction Amount
                  </Th>
                  <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
                    Closing Balance
                  </Th>
                </Tr>
              </THead>

              <TBody>
                {/* Agent Wallet Balance Row */}
                <Tr className="bg-gray-100 font-semibold text-gray-900 dark:bg-dark-700 dark:text-white">
                  <Td>Agent Wallet Balance</Td>
                  <Td className={'text-center'}>{transactionData?.openingBalance || '0'}</Td>
                  <Td className={'text-center'}>
                    {transactionData?.creditDebitType === 'DEBIT' && transactionData?.amount > 0 ? (
                      <span className={'text-error dark:text-error-light'}>
                        - {transactionData?.amount}
                      </span>
                    ) : (
                      <span className="text-success dark:text-success-light">
                        + {transactionData?.amount || '0'}
                      </span>
                    )}
                  </Td>
                  <Td className={'text-center'}>{transactionData?.closingBalance || '0'}</Td>
                </Tr>
              </TBody>
            </Table>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={onClose}>
              {t('Close')}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
