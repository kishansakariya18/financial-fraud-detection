// Import Dependencies
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

// ----------------------------------------------------------------------

export function CategoryGameFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = '',
  breadcrumbItem,
  isGameList
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { hasPermission } = usePermissions();

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {hasPermission(PERMISSIONS.CATEGORY.ADD_GAMES_TO_CATEGORY) && !isGameList && (
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
            color="primary"
            onClick={() => navigate(`/casino/category/list/select-games/${categoryId}/list`)}>
            <PlusIcon className="size-5" />
            <span>{t('add') + ' ' + t('games')}</span>
          </Button>
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
      value={table?.getColumn('name')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('name').setFilterValue(e.target.value)}
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
      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('search')}
        </Button>
        <Button
          onClick={onClearFilters}
          disabled={!isFiltered}
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs">
          {t('reset') + ' ' + t('filter')}
        </Button>
      </div>
    </>
  );
}

CategoryGameFilters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  pageTitle: PropTypes.string,
  breadcrumbItem: PropTypes.array,
  isGameList: PropTypes.bool
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
