// Import Dependencies
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
// import { TbCurrencyDollar } from "react-icons/tb";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Local Imports
// import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
// import { RangeFilter } from "components/shared/table/RangeFilter";
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
// import { globallyBlockedStatusOptions, statusOptions } from '../helper';
import { DashboardCard } from 'components/custom/DashboardCard';
import { dummyCards } from 'helpers/functions';

// ----------------------------------------------------------------------

export function CountryFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = '',
  summary = {}
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const { t } = useTranslation();

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
      </div>
      <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
        <DashboardCard
          label={dummyCards.Country.TOTAL_COUNTRY.key}
          value={summary ? summary.totalCountries : dummyCards.Country.TOTAL_COUNTRY.value}
          gradientFrom={dummyCards.Country.TOTAL_COUNTRY.gradientFrom}
          gradientTo={dummyCards.Country.TOTAL_COUNTRY.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Country.BLOCKED_COUNTRY.key}
          value={
            summary.blockedCountries
              ? summary.blockedCountries
              : dummyCards.Country.BLOCKED_COUNTRY.value
          }
          gradientFrom={dummyCards.Country.BLOCKED_COUNTRY.gradientFrom}
          gradientTo={dummyCards.Country.BLOCKED_COUNTRY.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput table={table} />
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
              t={t}
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
            <SearchInput table={table} />
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              t={t}
            />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table?.getColumn('countryName')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('countryName').setFilterValue(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder="Search Country Name, Code . . ."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {}, t }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {/* {table.getColumn('status') && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn('status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('globallyBlocked') && (
        <FacedtedFilter
          options={globallyBlockedStatusOptions}
          column={table.getColumn('globallyBlocked')}
          title="Global Status"
          isMultiple={false}
          showCheckbox={false}
        />
      )} */}

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

CountryFilters.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object
};

Filters.propTypes = {
  table: PropTypes.object
};
