import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';
import { useTranslation } from 'react-i18next';

import { columns } from './columns';
import { DisposableEmailToolbar } from './Toolbar';
import BlacklistService from 'services/blacklist.services';
import { getQueryParams } from 'utils/custom.utilities';
import { disposablEmailResponseMapper } from '../helper';

export default function DisposableEmailList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('disposable') + ' ' + t('email');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchData = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await BlacklistService.getDisposableEmailDomainList({
      pagination: { pageIndex, pageSize }
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: disposablEmailResponseMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, tableSettings, setError } = useTable({
    columns,
    fetchData,
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
  }, [error, isLoading, setError]);

  // const fetchNewList = async (isRefetch = false) => {
  //   await table.options.meta?.fetchData(isRefetch);
  // };

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <DisposableEmailToolbar table={table} pageTitle={pageTitle} />
      <TableCard table={table} loading={isLoading} tableSettings={tableSettings} />
    </ContentWrapper>
  );
}
