import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { DateFilter } from 'components/shared/table/DateFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import usePermissions from 'app/router/usePermissions';

/**
 * Reusable Table Toolbar Component
 *
 * @param {Object} props
 * @param {Object} props.table - TanStack table instance
 * @param {string} props.pageTitle - Page title to display
 * @param {Function} props.onApplyFilters - Callback when apply filters is clicked
 * @param {Function} props.onClearFilters - Callback when clear filters is clicked
 * @param {string} props.searchColumn - Column name for search (default: 'name')
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {boolean} props.showSearch - Whether to show search input (default: true)
 * @param {Object} props.createButton - Create button configuration
 * @param {boolean} props.createButton.show - Whether to show create button
 * @param {string} props.createButton.permission - Permission required to show button
 * @param {string} props.createButton.route - Route to navigate on click
 * @param {string} props.createButton.text - Button text (defaults to translation)
 * @param {Array} props.filters - Array of filter configurations
 * @param {string} props.filters[].type - Filter type: 'faceted' | 'date' // TODO: Add other filter types
 * @param {string} props.filters[].column - Column name for filter
 * @param {string} props.filters[].title - Filter title
 * @param {Array} props.filters[].options - Options for faceted filter // TODO: Add other filter options
 * @param {boolean} props.filters[].isMultiple - Whether faceted filter allows multiple selection // TODO: Add other filter options
 * @param {boolean} props.filters[].showCheckbox - Whether to show checkbox in faceted filter // TODO: Add other filter options
 * @param {Object} props.filters[].config - Configuration for date filter // TODO: Add other filter options
 */
export function TableToolbar({
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {},
  searchColumn = 'name',
  searchPlaceholder = '',
  showSearch = true,
  createButton = {
    show: false,
    permission: '',
    route: '',
    text: ''
  },
  filters = []
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isXs } = useBreakpointsContext();
  const { hasPermission } = usePermissions();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  const canCreate =
    createButton.show && createButton.permission && hasPermission(createButton.permission);
  const createButtonText = createButton.text || t('create');

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0 space-y-2">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
        </div>

        {canCreate && (
          <div className="flex items-center gap-2">
            <Button
              className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
              color="primary"
              onClick={() => navigate(createButton.route)}>
              <PlusIcon className="size-5" />
              <span>{createButtonText}</span>
            </Button>
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            {showSearch && (
              <SearchInput
                table={table}
                searchColumn={searchColumn}
                searchPlaceholder={searchPlaceholder || t('search') + '...'}
                onApplyFilters={onApplyFilters}
              />
            )}
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              'hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <Filters
              table={table}
              filters={filters}
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
            {showSearch && (
              <SearchInput
                table={table}
                searchColumn={searchColumn}
                searchPlaceholder={searchPlaceholder || t('search') + '...'}
                onApplyFilters={onApplyFilters}
              />
            )}
            <Filters
              table={table}
              filters={filters}
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

function SearchInput({ table, searchColumn, searchPlaceholder, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn(searchColumn)?.getFilterValue() || ''}
      onChange={(event) => table.getColumn(searchColumn).setFilterValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onApplyFilters();
        }
      }}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder={searchPlaceholder}
    />
  );
}

function Filters({ table, filters = [], onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {filters.map((filter, index) => {
        if (filter.type === 'faceted' && table.getColumn(filter.column)) {
          return (
            <FacedtedFilter
              key={index}
              options={filter.options}
              column={table.getColumn(filter.column)}
              title={filter.title}
              isMultiple={filter.isMultiple || false}
              showCheckbox={filter.showCheckbox || false}
            />
          );
        }
        if (filter.type === 'date' && table.getColumn(filter.column)) {
          return (
            <DateFilter
              key={index}
              column={table.getColumn(filter.column)}
              title={filter.title}
              config={filter.config || { mode: 'range', maxDate: new Date().fp_incr?.(1) }}
            />
          );
        }
        return null;
      })}

      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('apply_filters') || 'Apply Filters'}
        </Button>
        <Button
          onClick={onClearFilters}
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!isFiltered}>
          {t('reset') || 'Reset'}
        </Button>
      </div>
    </>
  );
}

TableToolbar.propTypes = {
  table: PropTypes.object.isRequired,
  pageTitle: PropTypes.string,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  searchColumn: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  createButton: PropTypes.shape({
    show: PropTypes.bool,
    permission: PropTypes.string,
    route: PropTypes.string,
    text: PropTypes.string
  }),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['faceted', 'date']).isRequired,
      column: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      options: PropTypes.array, // For faceted filter
      isMultiple: PropTypes.bool, // For faceted filter
      showCheckbox: PropTypes.bool, // For faceted filter
      config: PropTypes.object // For date filter
    })
  )
};

SearchInput.propTypes = {
  table: PropTypes.object.isRequired,
  searchColumn: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
  filters: PropTypes.array,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
