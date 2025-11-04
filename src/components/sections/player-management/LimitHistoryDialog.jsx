import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CustomModal } from 'components/custom/CustomModal';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useCurrencyContext } from 'app/contexts/currency/context';
import PropTypes from 'prop-types';
import { createColumnHelper } from '@tanstack/react-table';
import useTable from 'components/ui/useTable';
import TableCard from 'components/ui/custom/TableCard';
import PlayerService from 'services/player.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

const columnHelper = createColumnHelper();

const LimitHistoryDialog = ({
  isOpen,
  onClose,
  userUID = null,
  userClassUID = null,
  setBy = null,
  limitType = null,
  limitPeriod = null
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyContext();
  const [queryParams, setQueryParams] = useState({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PER_PAGE_RECORD
  });

  // Get dialog title
  const getDialogTitle = () => {
    if (!limitType || !limitPeriod) {
      return t('limit') + ' ' + t('history');
    }

    if (userClassUID) {
      // User class limit history
      return `${t('player_class_limit')} - ${capitalizeFirstLetter(limitPeriod)} ${capitalizeFirstLetter(limitType)} ${t('history')}`;
    }

    const setByLabel =
      setBy === 'user' ? t('responsible_gambling_limit') : t('player_account_limit');

    return `${setByLabel} - ${capitalizeFirstLetter(limitPeriod)} ${capitalizeFirstLetter(limitType)} ${t('history')}`;
  };

  // Create columns
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => {
          const limitAmount =
            row.limitAmount || row.LimitAmount || row.displayLimitAmount || row.DisplayLimitAmount;
          return limitAmount > 0 && row?.LimitType !== 'session'
            ? formatCurrency(limitAmount)
            : limitAmount || '-';
        },
        {
          id: 'limitAmount',
          header: `${t('limit')} ${t('amount')}`,
          cell: (info) => (
            <span className="font-medium text-gray-900 dark:text-white">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      ),
      columnHelper.accessor(
        (row) => {
          const effectiveFrom = row.effectiveFrom || row.EffectiveFrom;
          return effectiveFrom ? getDateInUTCToTimeZone(effectiveFrom) : '-';
        },
        {
          id: 'effectiveFrom',
          header: t('effectiveFrom'),
          cell: (info) => (
            <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      ),
      columnHelper.accessor(
        (row) => {
          const effectiveTo = row.effectiveTo || row.EffectiveTo;
          return effectiveTo ? getDateInUTCToTimeZone(effectiveTo) : '-';
        },
        {
          id: 'effectiveTo',
          header: t('effectiveTo'),
          cell: (info) => (
            <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      ),
      columnHelper.accessor(
        (row) => {
          const isActive = row.isActive !== undefined ? row.isActive : row.IsActive;
          return isActive === 1 || isActive === true ? t('active') : t('inactive');
        },
        {
          id: 'status',
          header: t('status'),
          cell: (info) => (
            <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      ),
      columnHelper.accessor(
        (row) => {
          const dateCreated = row.dateCreated || row.DateCreated;
          return dateCreated ? getDateInUTCToTimeZone(dateCreated) : '-';
        },
        {
          id: 'dateCreated',
          header: t('createdAt'),
          cell: (info) => (
            <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      )
    ],
    [t, formatCurrency]
  );

  // Fetch history data - using useCallback like the reference implementation
  const fetchHistoryData = useCallback(
    async (params) => {
      // Check required parameters based on type
      if (userClassUID) {
        // User class limit history
        if (!userClassUID || !limitType || !limitPeriod) {
          return { status: 400, data: [], totalRecords: 0 };
        }
      } else {
        // Regular limit history
        if (!userUID || !setBy || !limitType || !limitPeriod) {
          return { status: 400, data: [], totalRecords: 0 };
        }
      }

      // Use params from useTable if provided, otherwise fall back to queryParams
      const pageIndex = isNaN(params?.pageIndex)
        ? isNaN(queryParams.pageIndex)
          ? DEFAULT_PAGE_INDEX
          : +queryParams.pageIndex
        : +params.pageIndex;
      const pageSize = isNaN(params?.pageSize)
        ? isNaN(queryParams.pageSize)
          ? DEFAULT_PER_PAGE_RECORD
          : +queryParams.pageSize
        : +params.pageSize;

      // Call appropriate service based on type
      const apiCall = userClassUID
        ? PlayerService.getUserClassLimitHistory(userClassUID, {
            limitType,
            limitPeriod,
            page: pageIndex + 1,
            per_page: pageSize
          })
        : PlayerService.getLimitHistory(userUID, {
            setBy,
            limitType,
            limitPeriod,
            page: pageIndex + 1,
            per_page: pageSize
          });

      return apiCall
        .then(({ response }) => {
          const responseData = response?.data || response?.Data || [];
          const totalRecords = response?.totalRecords || response?.total_record || 0;

          // Handle both array and grouped data
          const data = Array.isArray(responseData) ? responseData : [];

          return {
            status: 200,
            data,
            totalRecords: parseInt(totalRecords, 10) || data.length || 0
          };
        })
        .catch((error) => {
          console.error('Error fetching limit history:', error);
          toast.error(error?.message || 'Failed to fetch history');
          return { status: 500, data: [], totalRecords: 0 };
        });
    },
    [queryParams, userUID, userClassUID, setBy, limitType, limitPeriod]
  );

  // Create setSearchParams function that updates queryParams state
  // This is needed for useTable to manage pagination properly
  // useTable passes a function that expects URLSearchParams-like interface
  const handleSetSearchParams = useMemo(
    // eslint-disable-next-line no-unused-vars
    () => (updater, options) => {
      if (typeof updater === 'function') {
        setQueryParams((prev) => {
          // Create a mock URLSearchParams-like object for Object.fromEntries
          const mockParams = new Map([
            ['pageIndex', String(prev.pageIndex)],
            ['pageSize', String(prev.pageSize)]
          ]);
          // Call the updater function with the mock params
          const newParams = updater(mockParams);
          // Extract the values from the result
          return {
            pageIndex: newParams.pageIndex !== undefined ? +newParams.pageIndex : prev.pageIndex,
            pageSize: newParams.pageSize !== undefined ? +newParams.pageSize : prev.pageSize
          };
        });
      } else {
        setQueryParams((prev) => ({
          ...prev,
          pageIndex: updater.pageIndex !== undefined ? +updater.pageIndex : prev.pageIndex,
          pageSize: updater.pageSize !== undefined ? +updater.pageSize : prev.pageSize
        }));
      }
    },
    []
  );

  const { table, isLoading, error, setError, tableSettings, setPagination } = useTable({
    columns,
    fetchData: fetchHistoryData,
    queryParams,
    setSearchParams: handleSetSearchParams,
    initialSettings: {
      tableSettings: { enableFullScreen: false, enableRowDense: false },
      columnVisibility: {}
    },
    paginationEnabled: true
  });

  // Reset pagination when dialog opens or filters change
  useEffect(() => {
    const hasRequiredParams = userClassUID
      ? isOpen && userClassUID && limitType && limitPeriod
      : isOpen && userUID && setBy && limitType && limitPeriod;

    if (hasRequiredParams) {
      setQueryParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
      });
      if (setPagination) {
        setPagination({
          pageIndex: DEFAULT_PAGE_INDEX,
          pageSize: DEFAULT_PER_PAGE_RECORD,
          totalCount: 0
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userUID, userClassUID, setBy, limitType, limitPeriod]);

  // Trigger data fetch when dialog opens
  useEffect(() => {
    const hasRequiredParams = userClassUID
      ? isOpen && userClassUID && limitType && limitPeriod && table?.options?.meta?.fetchNewList
      : isOpen &&
        userUID &&
        setBy &&
        limitType &&
        limitPeriod &&
        table?.options?.meta?.fetchNewList;

    if (hasRequiredParams) {
      table.options.meta.fetchNewList(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userUID, userClassUID, setBy, limitType, limitPeriod]);

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <CustomModal show={isOpen} onClose={onClose} title={getDialogTitle()} sizeClass="max-w-5xl">
      <div className="min-h-[400px]">
        <TableCard
          tableSettings={tableSettings}
          table={table}
          loading={isLoading}
          paginationEnabled={true}
          disableDefaultPadding={true}
          loadingRows={5}
        />
      </div>
    </CustomModal>
  );
};

LimitHistoryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userUID: PropTypes.string,
  userClassUID: PropTypes.string,
  setBy: PropTypes.string,
  limitType: PropTypes.string,
  limitPeriod: PropTypes.string
};

export default LimitHistoryDialog;
