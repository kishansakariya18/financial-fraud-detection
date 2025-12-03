import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import TableCard from 'components/ui/custom/TableCard';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import GamesService from 'services/games.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { gameSelectionModalColumns } from './columns';
import { Button } from 'components/ui';
import { CustomModal } from 'components/custom';
import { responseMapper } from 'app/pages/casino-management/games/helper';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { statusOptions } from 'app/pages/casino-management/games/helper';
import ProviderService from 'services/provider.services';
import { toast } from 'sonner';

export default function GamesListModal({
  open,
  onClose,
  onSelectSubmit,
  selectedItems,
  providerIds = [],
  categoryIds = []
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const [checkedRows, setCheckedRows] = useState([]);
  const checkedIds = useMemo(() => checkedRows.map((row) => row.value), [checkedRows]);
  const [providerOptions, setProviderOptions] = useState([]);

  const handleCheck = (row) => {
    const isChecked = checkedRows.some((item) => item.value === row.id);
    if (!isChecked) {
      // Store game with provider and category IDs
      setCheckedRows((prev) => [
        ...prev,
        {
          value: row.id,
          label: row.name,
          providerId: row.providerId,
          categoryId: row.categoryId
        }
      ]);
    } else {
      setCheckedRows((prev) => prev.filter((item) => item.value !== row.id));
    }
  };

  const handleTogglePageSelection = (tableInstance) => {
    let currentRows = tableInstance.getRowModel().rows.map((row) => row.original);
    if (currentRows.length === 0) {
      return;
    }
    currentRows = currentRows.map((row) => ({
      value: row.id,
      label: row.name,
      providerId: row.providerId,
      categoryId: row.categoryId
    }));

    setCheckedRows((prev) => {
      const allSelected = currentRows.every((row) => prev.some((item) => item.value === row.value));

      if (allSelected) {
        return prev.filter((item) => !currentRows.some((row) => row.value === item.value));
      }
      const mergedMap = new Map(prev.map((item) => [item.value, item]));
      currentRows.forEach((row) => mergedMap.set(row.value, row));
      return Array.from(mergedMap.values());
    });
  };

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await ProviderService.getProviderList({
          filters: { status: 1 },
          isPaginationRequired: false
        });
        if (res?.status === 200) {
          const items = Array.isArray(res.response?.data) ? res.response.data : [];
          const options = items
            .filter((p) => p?.ProviderID != null)
            .map((p) => ({ value: p.ProviderID, label: p.Name || String(p.ProviderID) }));
          setProviderOptions(options);
        } else if (res?.error) {
          toast.error(res.error);
        }
      } catch {
        toast.error('Unable to load providers');
      }
    };

    loadProviders();
  }, []);

  const fetchGames = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await GamesService.getGamesList({
      pagination: { pageIndex, pageSize },
      filters: {
        ...queryParams,
        providerIds,
        categoryIds
      }
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: responseMapper(result.response.data),
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };
  useEffect(() => {
    if (selectedItems) {
      setCheckedRows(selectedItems);
    }
  }, [selectedItems]);

  const columns = gameSelectionModalColumns({
    selectedIds: checkedIds,
    handleCheck,
    actionLabel: 'Select',
    onTogglePageSelection: handleTogglePageSelection
  });

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchGames,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['select', 'id'], right: ['actions'] },
      tableSettings: {
        enableFullScreen: false,
        enableRowDense: false
      }
    }
  });

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'name', value: queryParams.keyword });
    }
    if (queryParams.status) {
      filtersFromQuery.push({ id: 'status', value: queryParams.status });
    }
    if (queryParams.provider) {
      filtersFromQuery.push({ id: 'provider', value: +queryParams.provider });
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
        filterItems.status = data.value;
      }

      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }

      if (data.id === 'provider') {
        filterItems.provider = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] }),
      ...(filterItems.provider && { provider: filterItems.provider })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
      });
    }
    table.resetColumnFilters();
  };

  // useLockScrollbar(tableSettings.enableFullScreen);
  const onSubmit = async () => {
    onSelectSubmit(checkedRows);
  };

  return (
    <CustomModal
      title={t('game_selection')}
      show={open}
      onClose={onClose}
      sizeClass="max-w-7xl"
      modalFooter={
        <Button
          type="button"
          color="primary"
          disabled={checkedRows.length === 0}
          onClick={onSubmit}
          className="whitespace-nowrap">
          {t('assign') + ' ' + t('selected')}
        </Button>
      }>
      <TableToolbar
        table={table}
        disableGutters
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        searchColumn="name"
        searchPlaceholder={t('search') + ' games...'}
        filters={[
          {
            type: 'faceted',
            column: 'status',
            title: t('status'),
            options: statusOptions,
            isMultiple: true,
            showCheckbox: true
          },
          {
            type: 'faceted',
            column: 'provider',
            title: t('provider'),
            options: providerOptions,
            isMultiple: false,
            showCheckbox: false
          }
        ]}
      />
      <TableCard
        tableSettings={tableSettings}
        table={table}
        loading={isLoading}
        disableDefaultPadding
      />
    </CustomModal>
  );
}
