import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { countryColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { restrictedCountryMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import ProviderService from 'services/provider.services';
import { RestrictedCountryFilters } from './countryFilters';
import { Button, Circlebar } from 'components/ui';

export default function RestrictedCountry() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('restricted_country') + ' ' + t('list');
  const [checked, setChecked] = useState([]);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };
  //   console.log('providerId:', providerId);
  const columns = countryColumns({ selectedIds: checked, handleCheck });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchCountry = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await ProviderService.restrictedCountryList(providerId, {
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: restrictedCountryMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns,
    fetchData: fetchCountry,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { right: ['actions'] },
      tableSettings: {}
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'name', value: queryParams.keyword });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    // console.log('table.getState().columnFilters:', table.getState().columnFilters);

    for (let data of table.getState().columnFilters) {
      if (data.id === 'name') {
        filterItems.keyword = data.value;
      }
    }

    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: 0,
        pageSize: 10
      });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // console.log('tableSettings: from reports', table);
  const onSubmit = async () => {
    setSubmitLoading(true);
    const result = await ProviderService.removeRestrictedCountry(providerId, checked);
    console.log('result:', result);

    if (result.status === 200) {
      setSubmitResponse(result.response.message);
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };
  if (!submitLoading && !submitError && submitResponse) {
    console.log('errrrrr', submitResponse);
    toast.success(submitResponse);
    navigate('/casino/provider/list');
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
  }
  const breadcrumbItem = [
    { title: t('casino_provider'), path: '/casino/provider/list' },
    { title: t('restricted_country') }
  ];
  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      {/* <Toolbar breadcrumbs={breadcrumbs} table={table} pageTitle={pageTitle} /> */}
      <RestrictedCountryFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
        // filters= {}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
      {!submitLoading && (
        <div className="flex justify-center">
          <Button
            type="button"
            className="ml-6 mt-4"
            color="primary"
            disabled={checked == 0}
            onClick={onSubmit}>
            {t('remove')}
          </Button>
        </div>
      )}
      {submitLoading && (
        <div className="mt-4 flex justify-center">
          <Circlebar size={8} strokeWidth={8} color="primary" isIndeterminate />
        </div>
      )}
    </ContentWrapper>
  );
}
