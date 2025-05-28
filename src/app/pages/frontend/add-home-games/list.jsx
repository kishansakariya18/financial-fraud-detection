import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { Toolbar } from './Toolbar';
import { addHomeGameColumns } from './column';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import HomePageService from 'services/home-page.services';
import { addHomeGameReponseMapper } from '../helper';
import { Button, Circlebar } from 'components/ui';

export default function AddHomeGames() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('add') + ' ' + t('homeGame') + ' ' + t('list');
  const { homeCategoryId } = useParams();
  const [checked, setChecked] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const columns = addHomeGameColumns({
    selectedIds: checked,
    handleCheck,
    actionLabel: <div className="text-center">Add</div>
  });

  const onSubmit = async () => {
    setSubmitLoading(true);
    const result = await HomePageService.addHomeGame({ homeCategoryId, gameIds: checked });
    console.log('result:', result);

    if (result.status === 201) {
      setSubmitResponse(result.response.message);
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };

  const fetchAddHomeGameList = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    const result = await HomePageService.getAddHomeGameList({
      pagination: { pageIndex, pageSize },
      filters: queryParams,
      homeCategoryId
    });

    const apiData = addHomeGameReponseMapper(result.response.data);

    if (result.status === 200) {
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchAddHomeGameList,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { firstName: false, lastName: false }
    }
  });

  if (!submitLoading && !submitError && submitResponse) {
    toast.success(submitResponse);
    table.options?.meta?.fetchNewList();
    setSubmitResponse('');
    setChecked([]);
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
    setSubmitError('');
  }

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
      filtersFromQuery.push({ id: 'gameName', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'gameName') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({ pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PER_PAGE_RECORD });
    }
    table.resetColumnFilters();
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
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
            {t('submit')}
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
