import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import TableCard from 'components/ui/custom/TableCard';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import PlayerService from 'services/player.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { Button } from 'components/ui';
import { CustomModal } from 'components/custom';
import { TableToolbar } from 'components/shared/table/TableToolbar';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from 'components/ui';

const columnHelper = createColumnHelper();

const playerSelectionColumns = ({ selectedIds, handleCheck, onTogglePageSelection }) => [
  columnHelper.display({
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={table.getRowModel().rows.every((row) => selectedIds.includes(row.original.id))}
        onChange={() => onTogglePageSelection(table)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedIds.includes(row.original.id)}
        onChange={() => handleCheck(row.original)}
      />
    )
  }),
  columnHelper.accessor('id', {
    header: 'Player ID',
    size: 100,
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('username', {
    header: 'Username',
    size: 150,
    cell: (info) => info.getValue() || '-'
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 200,
    cell: (info) => info.getValue() || '-'
  }),
  columnHelper.accessor('mobile', {
    header: 'Mobile',
    size: 150,
    cell: (info) => {
      const phoneCode = info.row.original.phoneCode;
      const mobile = info.getValue();
      if (!mobile) return '-';
      return phoneCode ? `${phoneCode} ${mobile}` : mobile;
    }
  }),
  columnHelper.accessor('referralCode', {
    header: 'Referral Code',
    size: 150,
    cell: (info) => info.getValue() || '-'
  })
];

export default function ReferrerSelectionModal({ open, onClose, onSelectSubmit, selectedItems }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const [checkedRows, setCheckedRows] = useState([]);
  const checkedIds = useMemo(() => checkedRows.map((row) => row.value), [checkedRows]);

  const handleCheck = (row) => {
    const isChecked = checkedRows.some((item) => item.value === row.id);
    if (!isChecked) {
      setCheckedRows((prev) => [
        ...prev,
        {
          value: row.id,
          label: row.username || row.email || `Player ${row.id}`
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
      label: row.username || row.email || `Player ${row.id}`
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

  const fetchReferrers = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    const result = await PlayerService.getReferrersList({
      page: pageIndex + 1,
      perPage: pageSize,
      keyword: queryParams.keyword || undefined,
      startDate: queryParams.startDate || undefined,
      endDate: queryParams.endDate || undefined
    });

    if (result?.status === 200) {
      const data = (result.response.data || []).map((player) => ({
        id: player.UserID,
        username: player.Username,
        email: player.Email,
        mobile: player.Mobile,
        phoneCode: player.PhoneCode,
        referralCode: player.ReferralCode
      }));

      return {
        status: 200,
        data,
        totalRecords: parseInt(result.response.totalRecords, 10) || 0
      };
    }

    return { status: result?.status || 500, error: result?.error };
  };

  useEffect(() => {
    if (selectedItems) {
      setCheckedRows(selectedItems);
    }
  }, [selectedItems]);

  const columns = playerSelectionColumns({
    selectedIds: checkedIds,
    handleCheck,
    onTogglePageSelection: handleTogglePageSelection
  });

  const { table, isLoading, tableSettings, setColumnFilters } = useTable({
    columns,
    fetchData: fetchReferrers,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['select', 'id'] },
      tableSettings: {
        enableFullScreen: false,
        enableRowDense: false
      }
    }
  });

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'username', value: queryParams.keyword });
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
      if (data.id === 'username') {
        filterItems.keyword = data.value;
      }

      if (data.id === 'createdAt') {
        filterItems.date = data.value;
      }
    }

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.date && { startDate: filterItems.date[0] }),
      ...(filterItems.date && { endDate: filterItems?.date[1] })
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

  const onSubmit = async () => {
    onSelectSubmit(checkedRows);
  };

  return (
    <CustomModal
      title={t('select') + ' ' + t('players')}
      show={open}
      onClose={onClose}
      sizeClass="max-w-6xl"
      modalFooter={
        <Button
          type="button"
          color="primary"
          disabled={checkedRows.length === 0}
          onClick={onSubmit}
          className="whitespace-nowrap">
          {t('select') + ' (' + checkedRows.length + ')'}
        </Button>
      }>
      <TableToolbar
        table={table}
        disableGutters
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        searchColumn="username"
        searchPlaceholder={t('search') + ' ' + t('players') + '...'}
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
