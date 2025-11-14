import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import WalletService from 'services/wallet-services';

export default function PlayerWallets({ playerId = null } = {}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player') + ' ' + t('wallets');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  // const params = useParams();
  // const userID = playerId || params.userID;

  const fetchPlayerWallets = useCallback(
    async (params = {}) => {
      try {
        const response = await WalletService.getAllWalletList({ userUID: playerId, ...params });
        // Transform the API response to match the expected format
        const wallets = response.response.data?.map((wallet) => ({
          id: wallet.WalletID,
          currencyCode: wallet.currency_code || '',
          currencyName: wallet.currency_name || '',
          realCashAmount: wallet.Balance || 0,
          bonusAmount: wallet.Bonus || 0,
          code: wallet.Currency != null ? wallet.Currency.Code : '-',
          name: wallet.Currency != null ? wallet.Currency.Name : '-'
        }));

        return {
          status: 200,
          data: wallets,
          totalRecords: response.response.total_records || wallets.length,
          totalPages: response.response.total_pages || 1
        };
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch wallets');
        return {
          status: error.response?.status || 500,
          data: [],
          totalRecords: 0,
          error: error.response?.data?.message || 'Failed to fetch wallets'
        };
      }
    },
    [playerId]
  );

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchPlayerWallets,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, setError, isLoading]);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {/* <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={() => {}}
        onClearFilters={() => {}}
      /> */}
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
