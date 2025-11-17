// Import Dependencies
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
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { statusOptions } from '../helper';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';

// import { useSearchParams } from 'react-router';
// import { CreateCategory } from '../CreateCategory';

// ----------------------------------------------------------------------

export function CurrencyFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  // const [searchParams] = useSearchParams();
  // console.log('table.getState().columnFilters: inside', Object.fromEntries([...searchParams]));

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
        {hasPermission(PERMISSIONS.CURRENCY.CREATE) && (
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
            color="primary"
            onClick={() => navigate('/casino-management/currencies/create')}>
            <PlusIcon className="size-5" />
            <span>{t('add') + ' ' + t('currency')}</span>
          </Button>
        )}
      </div>

      {/* <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
        <DashboardCard
          label={dummyCards.Provider.TOTAL_PROVIDER.key}
          value={summary ? summary?.providers.total : dummyCards.Provider.TOTAL_PROVIDER.value}
          gradientFrom={dummyCards.Provider.TOTAL_PROVIDER.gradientFrom}
          gradientTo={dummyCards.Provider.TOTAL_PROVIDER.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Provider.ACTIVE_PROVIDER.key}
          value={summary ? summary?.providers?.active : dummyCards.Provider.ACTIVE_PROVIDER.value}
          gradientFrom={dummyCards.Provider.ACTIVE_PROVIDER.gradientFrom}
          gradientTo={dummyCards.Provider.ACTIVE_PROVIDER.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Provider.INACTIVE_PROVIDER.key}
          value={
            summary ? summary?.providers?.inactive : dummyCards.Provider.INACTIVE_PROVIDER.value
          }
          gradientFrom={dummyCards.Provider.INACTIVE_PROVIDER.gradientFrom}
          gradientTo={dummyCards.Provider.INACTIVE_PROVIDER.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Provider.TOTAL_GAMES.key}
          value={summary ? summary?.games?.total : dummyCards.Provider.TOTAL_GAMES.value}
          gradientFrom={dummyCards.Provider.TOTAL_GAMES.gradientFrom}
          gradientTo={dummyCards.Provider.TOTAL_GAMES.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
      </div> */}
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
      value={table?.getColumn('Name')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('Name').setFilterValue(e.target.value)}
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
      placeholder="Search Name . . ."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('Status') && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn('Status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {/* {table.getColumn('CreatedAt') && (
        <DateFilter
          column={table.getColumn('CreatedAt')}
          title={t('date') + ' ' + t('range')}
          config={{
            maxDate: new Date().fp_incr(1),
            mode: 'range'
          }}
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

CurrencyFilters.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object
};
