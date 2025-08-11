import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';

export default function PlayerWallets() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('player') + ' ' + t('wallets');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchPlayerWallets = useCallback(async () => {
    // Mock data for wallets - replace with actual API call
    const mockWallets = [
      {
        id: 1,
        currencyCode: 'USD',
        currencyName: 'US Dollar',
        realCashAmount: 1500.5,
        bonusAmount: 250.0,
        totalAmount: 1750.5,
        status: 'active'
      },
      {
        id: 2,
        currencyCode: 'EUR',
        currencyName: 'Euro',
        realCashAmount: 800.25,
        bonusAmount: 100.0,
        totalAmount: 900.25,
        status: 'active'
      },
      {
        id: 3,
        currencyCode: 'BTC',
        currencyName: 'Bitcoin',
        realCashAmount: 0.05,
        bonusAmount: 0.01,
        totalAmount: 0.06,
        status: 'frozen'
      }
    ];

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: mockWallets,
          totalRecords: mockWallets.length
        });
      }, 500);
    });
  }, []);

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
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={() => {}}
        onClearFilters={() => {}}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
