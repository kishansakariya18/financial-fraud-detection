// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
// import { TbCurrencyDollar } from "react-icons/tb";
import PropTypes from 'prop-types';

// Local Imports
// import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
// import { RangeFilter } from "components/shared/table/RangeFilter";
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { getStageAppToApi, mapType, stageOptions, typeOptions } from '../helper';
import { useSearchParams } from 'react-router';
import { ExportCSV } from 'components/custom/export';
import { getQueryParams } from 'utils/custom.utilities';
import apiConfig from 'configs/api.config';
import moment from 'moment';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { useMemo } from 'react';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export function BetSlipFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [searchParams] = useSearchParams();
  const { hasPermission } = usePermissions();

  const filters = getQueryParams(searchParams);

  const exportFilters = useMemo(() => {
    const params = {};

    if (filters.startDate) {
      params.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      params.endDate = moment(+filters.endDate).endOf('day').toDate();
    }
    if (filters.keyword) {
      params.keyword = filters.keyword;
    }
    if (filters.stage) {
      params.stage = getStageAppToApi(filters.stage);
    }
    if (filters.type) {
      params.type = mapType(filters.type);
    }
    return params;
  }, [filters]);

  console.log('exportFilters:', exportFilters);

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
        </div>
        {hasPermission(PERMISSIONS.REPORT.BETSLIP_EXPORT_REPORT) && (
          <ExportCSV
            validateFilters={{
              startDate: filters.startDate,
              endDate: filters.endDate
            }}
            apiEndpoint={apiConfig.endPoints.REPORTS.BETSLIP_EXPORT}
            requestFilters={{
              startDate: filters.startDate
                ? String(dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss'))
                : '',
              endDate: filters.endDate
                ? String(
                    dayjs(+filters.endDate)
                      .hour(23)
                      .minute(59)
                      .second(59)
                      .format('YYYY-MM-DD HH:mm:ss')
                  )
                : '',
              keyword: filters.keyword || ''
            }}
          />
        )}
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              'hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className={clsx(
              'custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}
            style={{
              '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)'
            }}>
            <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
              <SearchInput table={table} onApplyFilters={onApplyFilters} />
              <Filters
                table={table}
                onApplyFilters={onApplyFilters}
                onClearFilters={onClearFilters}
              />
            </div>

            <TableConfig table={table} />
          </div>
        </>
      )}
    </div>
  );
}

function SearchInput({ table, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn('username')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('username').setFilterValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onApplyFilters();
        }
      }}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder="Search Username . . ."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('stage') && (
        <FacedtedFilter
          options={stageOptions}
          column={table.getColumn('stage')}
          title="Stage"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('type') && (
        <FacedtedFilter
          options={typeOptions}
          column={table.getColumn('type')}
          title="User's Type"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('createdAt') && (
        <DateFilter
          column={table.getColumn('createdAt')}
          title={t('date') + ' ' + t('range')}
          config={{
            maxDate: new Date().fp_incr(1),
            mode: 'range'
          }}
        />
      )}

      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('search')}
        </Button>
        <Button
          onClick={onClearFilters}
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!isFiltered}>
          {t('reset') + ' ' + t('filter')}
        </Button>
      </div>
    </>
  );
}

BetSlipFilters.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object
};
