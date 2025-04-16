// Import Dependencies
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
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
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

// import { useSearchParams } from 'react-router';
// import { CreateCategory } from '../CreateCategory';

// ----------------------------------------------------------------------

export function RestrictedCountryFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = '',
  breadcrumbItem,
  isCountryList
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  // const [searchParams] = useSearchParams();

  // console.log('table.getState().columnFilters: inside', Object.fromEntries([...searchParams]));
  const navigate = useNavigate();
  const { providerId } = useParams();
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
        {!isCountryList && (
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
            color="primary"
            onClick={() => navigate(`/casino/provider/select-countries/${providerId}/list`)}>
            <PlusIcon className="size-5" />
            <span>{t('add') + ' ' + t('restricted_country')}</span>
          </Button>
        )}
      </div>
      <div className="ml-7 mt-2">
        <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
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
              <SearchInput table={table} />
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

function SearchInput({ table }) {
  return (
    <Input
      value={table?.getColumn('name')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('name').setFilterValue(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder="Search Name . . ."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
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

RestrictedCountryFilters.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object
};

Filters.propTypes = {
  table: PropTypes.object
};
