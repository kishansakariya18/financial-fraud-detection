import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLockScrollbar } from 'hooks';
import TableCard from 'components/ui/custom/TableCard';
import useTable from 'components/ui/useTable';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

export default function PlayerList({
  fetchData,
  columns,
  hideToolbar = false,
  initialSettings = {},
  paginationEnabled = true,
  syncWithUrl = true
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState(() => getQueryParams(searchParams));

  // Sync queryParams with searchParams only if pagination is enabled and syncWithUrl is true
  useEffect(() => {
    if (paginationEnabled && syncWithUrl) {
      const newParams = getQueryParams(searchParams);
      setQueryParams((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newParams)) {
          return newParams;
        }
        return prev;
      });
    }
  }, [searchParams, paginationEnabled, syncWithUrl]);

  const handleSetSearchParams = useCallback(
    (updater) => {
      if (paginationEnabled && syncWithUrl) {
        setSearchParams((prev) => {
          const prevParams = new URLSearchParams(prev);
          let nextParams;

          if (typeof updater === 'function') {
            const result = updater(prevParams);
            nextParams = new URLSearchParams(result);
          } else {
            nextParams = new URLSearchParams(prevParams);
            Object.entries(updater).forEach(([key, value]) => {
              if (value === undefined || value === null) {
                nextParams.delete(key);
              } else {
                nextParams.set(key, value);
              }
            });
          }

          // Sort keys to ensure consistent string representation for comparison
          nextParams.sort();
          prevParams.sort();

          if (nextParams.toString() === prevParams.toString()) {
            return prev;
          }
          return nextParams;
        });
      } else {
        // For modal (no URL sync), update local state
        if (typeof updater === 'function') {
          setQueryParams((prev) => {
            const prevParams = new URLSearchParams();
            Object.entries(prev).forEach(([k, v]) => {
              if (v !== undefined && v !== null) prevParams.set(k, v);
            });

            const newParams = updater(prevParams);
            // Ensure newParams is converted to URLSearchParams so it is iterable for getQueryParams
            // updater might return a plain object or URLSearchParams
            const paramsInstance = new URLSearchParams(newParams);
            return getQueryParams(paramsInstance);
          });
        } else {
          setQueryParams((prev) => ({ ...prev, ...updater }));
        }
      }
    },
    [paginationEnabled, syncWithUrl, setSearchParams]
  );

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData,
    queryParams,
    setSearchParams: handleSetSearchParams,
    initialSettings: {
      columnPinning: { left: ['userID', 'UserID'], right: [] },
      tableSettings: {},
      columnVisibility: {},
      ...initialSettings
    },
    paginationEnabled
  });

  useEffect(() => {
    if (paginationEnabled) {
      const filtersFromQuery = [];
      if (queryParams.keyword) {
        filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
      }
      if (queryParams.status) {
        filtersFromQuery.push({ id: 'status', value: queryParams.status });
      }
      setColumnFilters(filtersFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, paginationEnabled]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'username') {
        filterItems.keyword = data.value;
      }
      if (data.id === 'status') {
        filterItems.status = data.value;
      }
    }

    handleSetSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status })
    });
  };

  const clearFilterHandler = () => {
    // Reset column filters in the table
    table.resetColumnFilters();

    // Only clear URL query params if syncing with URL (not for modal/offline pagination)
    if (syncWithUrl && !isEmptyObject(queryParams)) {
      handleSetSearchParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD,
        keyword: undefined, // Remove keyword filter
        status: undefined // Remove status filter
      });
    }
  };

  useLockScrollbar(tableSettings?.enableFullScreen);

  return (
    <>
      {!hideToolbar && (
        <TableToolbar
          table={table}
          onApplyFilters={applyFilterHandler}
          onClearFilters={clearFilterHandler}
          searchColumn="username"
          searchPlaceholder={t('search') + ' ' + t('username') + ', ' + t('email') + '...'}
        />
      )}
      <TableCard
        tableSettings={tableSettings}
        table={table}
        loading={isLoading}
        paginationEnabled={paginationEnabled}
      />
    </>
  );
}
