// Import Dependencies
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const walletStatusOptions = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'frozen', label: 'Frozen', color: 'warning' }
];

export function Toolbar({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const breadcrumbItem = [{ title: t('players'), path: '/users/player' }, { title: t('wallets') }];

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
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'transition-content flex items-center justify-between gap-4',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              'transition-content',
              isFullScreenEnabled ? 'px-4 pb-4 sm:px-5' : 'px-[--margin-x] pb-4'
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
            'transition-content flex items-center justify-between gap-4',
            isFullScreenEnabled ? 'px-4 pb-4 sm:px-5' : 'px-[--margin-x] pb-4'
          )}>
          <div className="flex items-center gap-4">
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
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

function SearchInput({ table, onApplyFilters }) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder={t('search_wallets')}
        value={table.getState().globalFilter ?? ''}
        onChange={(value) => {
          table.setGlobalFilter(String(value));
          onApplyFilters();
        }}
        className="w-80 max-w-sm pl-10"
      />
    </div>
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const hasFilters = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center gap-2">
      <FacedtedFilter
        column={table.getColumn('status')}
        title={t('status')}
        options={walletStatusOptions}
        onApplyFilters={onApplyFilters}
      />

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={() => {
            table.resetColumnFilters();
            onClearFilters();
          }}
          className="h-8 px-2 lg:px-3">
          {t('reset')}
          <FunnelIcon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  pageTitle: PropTypes.string
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
