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
import PlayerService from 'services/users.services';
import PlatformLimitService from 'services/platform.services';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';

const columnHelper = createColumnHelper();

const LIMIT_TYPE = {
  PLATFORM: 'platform',
  USER_CLASS: 'userClass',
  USER: 'user'
};

const LimitHistoryDialog = ({
  isOpen,
  onClose,
  userUID = null,
  userClassUID = null,
  setBy = null,
  limitType = null,
  limitPeriod = null,
  isPlatformLimit = false
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyContext();
  const [queryParams, setQueryParams] = useState({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PER_PAGE_RECORD
  });

  const getLimitType = useMemo(() => {
    if (isPlatformLimit) return LIMIT_TYPE.PLATFORM;
    if (userClassUID) return LIMIT_TYPE.USER_CLASS;
    return LIMIT_TYPE.USER;
  }, [isPlatformLimit, userClassUID]);

  const hasRequiredParams = useMemo(() => {
    const baseParams = limitType && limitPeriod;
    if (getLimitType === LIMIT_TYPE.PLATFORM) return baseParams;
    if (getLimitType === LIMIT_TYPE.USER_CLASS) return baseParams && userClassUID;
    return baseParams && userUID && setBy;
  }, [getLimitType, limitType, limitPeriod, userClassUID, userUID, setBy]);

  const getDialogTitle = useMemo(() => {
    if (!limitType || !limitPeriod) {
      return `${t('limit')} ${t('history')}`;
    }

    const periodType = `${capitalizeFirstLetter(limitPeriod)} ${capitalizeFirstLetter(limitType)}`;
    const historyLabel = t('history');

    const titleMap = {
      [LIMIT_TYPE.PLATFORM]: `${t('platform_limit')} - ${periodType} ${historyLabel}`,
      [LIMIT_TYPE.USER_CLASS]: `${t('player_class_limit')} - ${periodType} ${historyLabel}`,
      [LIMIT_TYPE.USER]: `${setBy === 'user' ? t('responsible_gambling_limit') : t('player_account_limit')} - ${periodType} ${historyLabel}`
    };

    return titleMap[getLimitType] || `${t('limit')} ${historyLabel}`;
  }, [limitType, limitPeriod, getLimitType, setBy, t]);

  const getRowValue = (row, keys) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) return row[key];
    }
    return null;
  };

  const formatLimitAmount = useCallback(
    (row) => {
      const limitAmount = getRowValue(row, [
        'limitAmount',
        'LimitAmount',
        'displayLimitAmount',
        'DisplayLimitAmount'
      ]);
      if (!limitAmount) return '-';
      if (limitAmount > 0 && row?.LimitType !== 'session') {
        return formatCurrency(limitAmount);
      }
      return limitAmount;
    },
    [formatCurrency]
  );

  const formatDate = useCallback((date) => (date ? getDateInUTCToTimeZone(date) : '-'), []);

  const formatStatus = useCallback(
    (row) => {
      const isActive = getRowValue(row, ['isActive', 'IsActive']);
      return isActive === 1 || isActive === true ? t('active') : t('inactive');
    },
    [t]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor(formatLimitAmount, {
        id: 'limitAmount',
        header: `${t('limit')} ${t('amount')}`,
        cell: (info) => (
          <span className="font-medium text-gray-900 dark:text-white">{info.getValue()}</span>
        ),
        enableSorting: false
      }),
      columnHelper.accessor(
        (row) => formatDate(getRowValue(row, ['effectiveFrom', 'EffectiveFrom'])),
        {
          id: 'effectiveFrom',
          header: t('effective_from'),
          cell: (info) => (
            <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>
          ),
          enableSorting: false
        }
      ),
      columnHelper.accessor((row) => formatDate(getRowValue(row, ['effectiveTo', 'EffectiveTo'])), {
        id: 'effectiveTo',
        header: t('effective_to'),
        cell: (info) => <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>,
        enableSorting: false
      }),
      columnHelper.accessor(formatStatus, {
        id: 'status',
        header: t('status'),
        cell: (info) => <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>,
        enableSorting: false
      }),
      columnHelper.accessor((row) => formatDate(getRowValue(row, ['dateCreated', 'DateCreated'])), {
        id: 'dateCreated',
        header: t('createdAt'),
        cell: (info) => <span className="text-gray-700 dark:text-dark-200">{info.getValue()}</span>,
        enableSorting: false
      })
    ],
    [t, formatLimitAmount, formatDate, formatStatus]
  );

  const getPaginationParams = useCallback(
    (params) => {
      const getNumericValue = (value, defaultValue) => {
        const num = typeof value === 'number' ? value : +value;
        return isNaN(num) ? defaultValue : num;
      };

      return {
        pageIndex: getNumericValue(params?.pageIndex, queryParams.pageIndex || DEFAULT_PAGE_INDEX),
        pageSize: getNumericValue(params?.pageSize, queryParams.pageSize || DEFAULT_PER_PAGE_RECORD)
      };
    },
    [queryParams]
  );

  const buildApiParams = useCallback(
    (pageIndex, pageSize) => ({
      limitType,
      limitPeriod,
      page: pageIndex + 1,
      per_page: pageSize
    }),
    [limitType, limitPeriod]
  );

  const fetchApiCall = useCallback(
    (pageIndex, pageSize) => {
      const apiParams = buildApiParams(pageIndex, pageSize);

      const apiCallMap = {
        [LIMIT_TYPE.PLATFORM]: () => PlatformLimitService.getPlatformLimitHistory(apiParams),
        [LIMIT_TYPE.USER_CLASS]: () =>
          PlayerService.getUserClassLimitHistory(userClassUID, apiParams),
        [LIMIT_TYPE.USER]: () => PlayerService.getLimitHistory(userUID, { ...apiParams, setBy })
      };

      return apiCallMap[getLimitType]();
    },
    [buildApiParams, getLimitType, userClassUID, userUID, setBy]
  );

  const parseApiResponse = (response) => {
    const responseData = response?.data || response?.Data || [];
    const totalRecords = response?.totalRecords || response?.total_record || 0;
    return {
      data: Array.isArray(responseData) ? responseData : [],
      totalRecords: parseInt(totalRecords, 10) || 0
    };
  };

  const fetchHistoryData = useCallback(
    async (params) => {
      if (!hasRequiredParams) {
        return { status: 400, data: [], totalRecords: 0 };
      }

      const { pageIndex, pageSize } = getPaginationParams(params);

      try {
        const { response } = await fetchApiCall(pageIndex, pageSize);
        const { data, totalRecords } = parseApiResponse(response);
        return { status: 200, data, totalRecords };
      } catch (error) {
        console.error('Error fetching limit history:', error);
        toast.error(error?.message || 'Failed to fetch history');
        return { status: 500, data: [], totalRecords: 0 };
      }
    },
    [hasRequiredParams, getPaginationParams, fetchApiCall]
  );

  const handleSetSearchParams = useMemo(
    () => (updater) => {
      if (typeof updater === 'function') {
        setQueryParams((prev) => {
          const mockParams = new Map([
            ['pageIndex', String(prev.pageIndex)],
            ['pageSize', String(prev.pageSize)]
          ]);
          const newParams = updater(mockParams);
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

  useEffect(() => {
    if (isOpen && hasRequiredParams) {
      setQueryParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
      });
      setPagination?.({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD,
        totalCount: 0
      });
    }
  }, [isOpen, hasRequiredParams, setPagination]);

  useEffect(() => {
    if (isOpen && hasRequiredParams && table?.options?.meta?.fetchNewList) {
      table.options.meta.fetchNewList(true);
    }
  }, [isOpen, hasRequiredParams, table]);

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <CustomModal show={isOpen} onClose={onClose} title={getDialogTitle} sizeClass="max-w-5xl">
      <div className="min-h-[200px]">
        <TableCard
          tableSettings={tableSettings}
          table={table}
          loading={isLoading}
          paginationEnabled={true}
          disableDefaultPadding={true}
          loadingRows={3}
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
  limitPeriod: PropTypes.string,
  isPlatformLimit: PropTypes.bool
};

export default LimitHistoryDialog;
