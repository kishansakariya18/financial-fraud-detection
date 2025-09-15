import { MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { eventNameOptions } from './helper';

export function Toolbar({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = '',
  breadcrumbs = null,
  hideDateFilter = false,
  summaryData = null
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const breadcrumbItem = breadcrumbs || [];

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {pageTitle}
        </h2>
        {breadcrumbItem.length > 0 && (
          <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
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
              hideDateFilter={hideDateFilter}
              summaryData={summaryData}
            />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            'custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
            isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
          )}
          style={{
            '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)'
          }}>
          <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              hideDateFilter={hideDateFilter}
              summaryData={summaryData}
            />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function Filters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  hideDateFilter = false,
  summaryData = null
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('eventName') && (
        <FacedtedFilter
          options={eventNameOptions}
          column={table.getColumn('eventName')}
          title={t('event_name')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('eventDate') && !hideDateFilter && (
        <DateFilter
          column={table.getColumn('eventDate')}
          title={t('date') + ' ' + t('range')}
          config={{
            maxDate: new Date().fp_incr(1),
            mode: 'range'
          }}
        />
      )}

      {summaryData && hideDateFilter && (
        <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-dark-600 dark:bg-dark-700">
          <span className="text-gray-600 dark:text-dark-300">
            {t('period')}: {new Date(summaryData.periodStart).toLocaleDateString()} -{' '}
            {new Date(summaryData.periodEnd).toLocaleDateString()}
          </span>
        </div>
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

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  pageTitle: PropTypes.string,
  breadcrumbs: PropTypes.array,
  hideDateFilter: PropTypes.bool,
  summaryData: PropTypes.object
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  hideDateFilter: PropTypes.bool,
  summaryData: PropTypes.object
};
