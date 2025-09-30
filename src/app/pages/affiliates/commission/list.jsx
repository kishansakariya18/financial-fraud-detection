// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AffiliatesService from 'services/affiliates.services';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { columns } from './columns';
import { Toolbar as CommissionSummaryToolbar } from './Toolbar';

export function List() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const pageTitle = t('campaign') + ' ' + t('details');
  const { affiliateId } = useParams();

  const fetchData = async ({ pageIndex, pageSize, keyword: q }) => {
    const res = await AffiliatesService.getCommissionSummary({
      affiliateId,
      pagination: { pageIndex, pageSize },
      filters: { keyword: q || '' }
    });
    if (res.status === 200) {
      const apiData = res.response?.data || {};
      const payload = apiData?.data ? apiData.data : apiData;
      const totalRecords = apiData?.totalRecords ?? res.response?.totalRecords ?? payload.length;
      return { status: 200, data: payload, totalRecords };
    }
    return { status: res.status, error: res.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData,
    queryParams: useMemo(
      () => ({
        pageIndex: searchParams.get('pageIndex'),
        pageSize: searchParams.get('pageSize'),
        keyword: searchParams.get('keyword') || ''
      }),
      [searchParams]
    ),
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['AffiliateCommissionBalanceID'] },
      tableSettings: { enableFullScreen: false }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <CommissionSummaryToolbar
        pageTitle={pageTitle}
        keyword={keyword}
        setKeyword={setKeyword}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        table={table}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}

export default List;
