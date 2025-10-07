import { MagnifyingGlassIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { statusOptions, agentTypeOptions } from 'components/sections/b2b-agents/helper';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
export function AgentToolbar({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = '',
  onAddAgent,
  showAddButton = false,
  showAgentTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  breadcrumbs = null
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  console.log('pageTitle', pageTitle, { showAddButton, breadcrumbs });
  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="flex min-w-0 items-center gap-4">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>

          {breadcrumbs && (
            <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
              <div className="hidden self-stretch py-1 sm:flex">
                <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
              </div>
              <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
            </div>
          )}
        </div>
        {showAddButton && onAddAgent && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button onClick={onAddAgent} className="h-8 px-3 text-xs" color="primary">
              <PlusIcon className="mr-1 size-4" />
              {t('add') || 'Add'} {t('agent') || 'Agent'}
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
              showAgentTypeFilter={showAgentTypeFilter}
              showDateFilter={showDateFilter}
              showStatusFilter={showStatusFilter}
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
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              showAgentTypeFilter={showAgentTypeFilter}
              showDateFilter={showDateFilter}
              showStatusFilter={showStatusFilter}
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
      placeholder={t('search_desc')}
    />
  );
}

function Filters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  showAgentTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {showStatusFilter && table.getColumn('status') && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn('status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {showAgentTypeFilter && table.getColumn('agentType') && (
        <FacedtedFilter
          options={agentTypeOptions}
          column={table.getColumn('agentType')}
          title="Agent Type"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {showDateFilter && table.getColumn('createdAt') && (
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

AgentToolbar.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  pageTitle: PropTypes.string,
  onAddAgent: PropTypes.func,
  showAddButton: PropTypes.bool,
  showAgentTypeFilter: PropTypes.bool,
  showDateFilter: PropTypes.bool,
  showStatusFilter: PropTypes.bool,
  breadcrumbs: PropTypes.array
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  showAgentTypeFilter: PropTypes.bool,
  showDateFilter: PropTypes.bool,
  showStatusFilter: PropTypes.bool
};
