import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { gameColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { gameMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import CategoryService from 'services/category.services';
import { CategoryGameFilters } from './gameFilters';
import { Button, Circlebar } from 'components/ui';

export default function GameList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('games') + ' ' + t('list');
  const [checked, setChecked] = useState([]);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const columns = gameColumns({ selectedIds: checked, handleCheck, actionLabel: 'Add' });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchGames = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await CategoryService.gamesList(categoryId, {
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: gameMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0,
        totalPages: parseInt(result.response.totalPages, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns,
    fetchData: fetchGames,
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

  const onSubmit = async () => {
    setSubmitLoading(true);
    const result = await CategoryService.addCategoryGames(categoryId, checked);

    if (result.status === 201 || result.status === 200) {
      setSubmitResponse(result.response.message);
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };

  if (!submitLoading && !submitError && submitResponse) {
    toast.success(submitResponse);
    navigate(`/casino/category/list/category-games/${categoryId}/list`);
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
  }

  const breadcrumbItem = [
    { title: t('casino_category'), path: '/casino/category/list' },
    {
      title: t('games'),
      path: `/casino/category/list/category-games/${categoryId}/list`
    },
    { title: t('games') + ' ' + t('list') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <CategoryGameFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
        isGameList={true}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
      <div className="flex justify-center">
        <Button
          type="button"
          className="ml-6 mt-4"
          color="primary"
          disabled={checked == 0 || submitLoading}
          onClick={onSubmit}>
          {!submitLoading ? (
            t('submit')
          ) : (
            <Circlebar size={4} strokeWidth={4} color="primary" isIndeterminate />
          )}
        </Button>
      </div>
    </ContentWrapper>
  );
}
