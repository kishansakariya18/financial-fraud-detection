// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
// import { TbCurrencyDollar } from "react-icons/tb";
import PropTypes from 'prop-types';

// Local Imports
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
// import { RangeFilter } from "components/shared/table/RangeFilter";
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { statusOptions } from '../helper';

// ----------------------------------------------------------------------

export function CountryFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

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

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn('status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {isFiltered && (
        <div>
          <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
            {t('search')}
          </Button>
          <Button onClick={onClearFilters} className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs">
            {t('reset') + ' ' + t('filter')}
          </Button>
        </div>
      )}
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
