import { useState, useMemo } from 'react';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { columns } from './columns';
import BlacklistService from 'services/blacklist.services';
import { ipResponseMapper } from '../helper';
import { useSearchParams } from 'react-router';
import { getQueryParams } from 'utils/custom.utilities';
import Toolbar from './Toolbar';

export default function BlacklistIP() {
  const { t } = useTranslation();
  const pageTitle = t('blacklist') + ' ' + 'IP';
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const [searchValue, setSearchValue] = useState(queryParams.keyword || '');

  const fetchData = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    setLoading(true);
    const result = await BlacklistService.getBlacklistedIPList({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });
    setLoading(false);
    if (result?.status === 200) {
      return {
        status: 200,
        data: ipResponseMapper(result.response.data),
        totalRecords: result.response.totalRecords || 0
      };
    }
    return { status: result?.status || 500, error: result?.error || 'Unknown error' };
  };

  const { table, isLoading, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    }
  });

  const handleAdd = () => {
    // TODO: Open modal or navigate to add IP
    alert('Add Blacklist IP');
  };

  const handleApplyFilters = () => {
    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      keyword: searchValue
    });
  };

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        onAdd={handleAdd}
        table={table}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onApplyFilters={handleApplyFilters}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading || loading} />
    </ContentWrapper>
  );
}
