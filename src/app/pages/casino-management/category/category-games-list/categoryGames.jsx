import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';

// Local Imports - UI,Services,Helper,Utils
import { gameColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import { categoryGameMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import CategoryService from 'services/category.services';
import { CategoryGameFilters } from './gameFilters';
import { Button, Circlebar } from 'components/ui';

export default function CategoryGames() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('games') + ' ' + t('list');
  const [checked, setChecked] = useState([]);
  const handleCheck = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const columns = gameColumns({ selectedIds: checked, handleCheck, actionLabel: 'Remove' });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchGames = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await CategoryService.getCategoryGamesList(categoryId, {
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: categoryGameMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
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
  const [submitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async () => {
    setSubmitLoading(true);
    const result = await CategoryService.removeCategoryGames(categoryId, checked);

    if (result.status === 200) {
      toast.success(result.response.message);
      setChecked([]);
      table.options.meta.fetchNewList();
    } else {
      toast.error(result.error);
    }
    setSubmitLoading(false);
  };

  const breadcrumbItem = [
    { title: t('casino_category'), path: '/casino/category/list' },
    { title: t('games') }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <CategoryGameFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
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
            t('remove')
          ) : (
            <Circlebar size={4} strokeWidth={4} color="primary" isIndeterminate />
          )}
        </Button>
      </div>
    </ContentWrapper>
  );
}
