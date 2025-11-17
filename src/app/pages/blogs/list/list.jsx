import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { Toolbar } from './Toolbar';
import { columns } from './columns.jsx';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

import BlogService from '../../../../services/blog.services';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function Blogs() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('blogs');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchBlogs = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    return BlogService.getBlogList({
      pagination: { pageIndex, pageSize },
      filters: { ...queryParams }
    })
      .then(({ response }) => {
        return {
          status: 200,
          data: responseMapper(response.data),
          totalRecords: parseInt(response.totalRecords, 10) || 0
        };
      })
      .catch((error) => {
        return { status: 500, error: error };
      });
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchBlogs,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {},
      columnVisibility: { slug: false, authorName: false }
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
      filtersFromQuery.push({ id: 'title', value: queryParams.keyword });
    }
    if (queryParams.isActive !== undefined && queryParams.isActive !== '') {
      const statusValue = Number(queryParams.isActive);
      if (!Number.isNaN(statusValue)) {
        filtersFromQuery.push({
          id: 'status',
          value: statusValue === 1 ? 'active' : 'inactive'
        });
      }
    }
    if (queryParams.blogCategoryId !== undefined && queryParams.blogCategoryId !== '') {
      const categoryValue = Number(queryParams.blogCategoryId);
      if (!Number.isNaN(categoryValue)) {
        filtersFromQuery.push({
          id: 'categoryNames',
          value: categoryValue
        });
      }
    }
    if (queryParams.isFeatured !== undefined && queryParams.isFeatured !== '') {
      const featuredValue = Number(queryParams.isFeatured);
      if (!Number.isNaN(featuredValue)) {
        filtersFromQuery.push({
          id: 'isFeatured',
          value: featuredValue === 1
        });
      }
    }
    if (queryParams.startDate && queryParams.endDate) {
      filtersFromQuery.push({
        id: 'createdAt',
        value: [+queryParams.startDate, +queryParams.endDate]
      });
    }

    setColumnFilters(filtersFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'title') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'status') {
        filterItems.isActive = data.value === 'active' ? 1 : 0;
      }

      if (data.id === 'categoryNames') {
        filterItems.blogCategoryId = data.value;
      }

      if (data.id === 'isFeatured') {
        filterItems.isFeatured = data.value;
      }

      if (data.id === 'createdAt') {
        filterItems.startDate = data.value?.[0];
        filterItems.endDate = data.value?.[1];
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.isActive !== undefined && { isActive: filterItems.isActive }),
      ...(filterItems.blogCategoryId !== undefined &&
        filterItems.blogCategoryId !== null && {
          blogCategoryId: filterItems.blogCategoryId
        }),
      ...(filterItems.isFeatured !== undefined &&
        filterItems.isFeatured !== null && {
          isFeatured: filterItems.isFeatured ? 1 : 0
        }),
      ...(filterItems.startDate && { startDate: filterItems.startDate }),
      ...(filterItems.endDate && { endDate: filterItems.endDate })
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

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <Toolbar
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
