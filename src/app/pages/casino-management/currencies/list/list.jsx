import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useTable from 'components/ui/useTable';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { DataTable } from 'components/ui/custom/DataTable';
import CurrencyService from 'services/currency.services';
import { getQueryParams } from 'utils/custom.utilities';

import { columns } from './columns';
import CurrencyFilters from './currencyFilters';

export default function CurrencyList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('currency');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchCurrencies = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await CurrencyService.getCurrencyList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: result.response.data,
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError } = useTable({
    columns,
    fetchData: fetchCurrencies,
    queryParams,
    setSearchParams
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  return (
    <ContentWrapper title={pageTitle}>
      <TableCard>
        <CurrencyFilters />
        <DataTable table={table} isLoading={isLoading} />
      </TableCard>
    </ContentWrapper>
  );
}
