import { useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import { Toolbar } from './Toolbar';
import { columns } from './columns.jsx';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import BlogCategoryDialog from '../BlogCategoryDialog';
import { RowActions } from './RowActions';

import BlogCategoryService from '../../../../services/blog-category.services';

import { responseMapper } from '../helper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function BlogCategories() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('blog_categories');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchBlogCategories = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    return BlogCategoryService.getBlogCategoryList({
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

  const handleAddEditClickRef = useRef(null);

  // Create columns with edit handler
  const columnsWithEditHandler = useMemo(() => {
    return columns.map((col) => {
      if (col.id === 'actions') {
        return {
          ...col,
          cell: (props) => (
            <RowActions
              {...props}
              onAddEditClick={(categoryId) => {
                if (handleAddEditClickRef.current) {
                  handleAddEditClickRef.current(categoryId);
                }
              }}
            />
          )
        };
      }
      return col;
    });
  }, []);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columnsWithEditHandler,
    fetchData: fetchBlogCategories,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: {}
    }
  });

  const handleAddEditClick = (categoryId) => {
    setIsEdit(categoryId ? true : false);
    setEditCategoryId(categoryId || null);
    setDialogOpen(true);
  };

  handleAddEditClickRef.current = handleAddEditClick;

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditCategoryId(null);
    setIsEdit(false);
  };

  const handleDialogSuccess = () => {
    if (table?.options?.meta?.fetchNewList) {
      table.options.meta.fetchNewList(false);
    }
  };

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
    if (queryParams.isActive !== undefined && queryParams.isActive !== '') {
      filtersFromQuery.push({
        id: 'status',
        value: queryParams.isActive === 1 ? 'active' : 'inactive'
      });
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
      if (data.id === 'name') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'status') {
        filterItems.isActive = data.value === 'active' ? 1 : 0;
      }

      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.isActive !== undefined && { isActive: filterItems.isActive }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
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
        onCreateClick={() => handleAddEditClick(null)}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
      <BlogCategoryDialog
        show={dialogOpen}
        onClose={handleDialogClose}
        isEdit={isEdit}
        categoryId={editCategoryId}
        onSuccess={handleDialogSuccess}
      />
    </ContentWrapper>
  );
}
