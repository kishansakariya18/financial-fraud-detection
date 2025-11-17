import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { DateFilter } from 'components/shared/table/DateFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { bonusTemplateStatusOptions, bonusTemplateTypeOptions } from '../happer';

export function Toolbar({
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const navigate = useNavigate();
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

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

        <div className="flex items-center gap-2">
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
            color="primary"
            onClick={() => navigate('/bonus/templates/create')}>
            <PlusIcon className="size-5" />
            <span>Create Template</span>
          </Button>
        </div>
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
      )}
    </div>
  );
}

function SearchInput({ table, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn('templateName')?.getFilterValue() || ''}
      onChange={(event) => table.getColumn('templateName').setFilterValue(event.target.value)}
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
      placeholder="Search templates..."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={bonusTemplateStatusOptions}
          column={table.getColumn('status')}
          title="Status"
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('bonusType') && (
        <FacedtedFilter
          options={bonusTemplateTypeOptions}
          column={table.getColumn('bonusType')}
          title="Bonus Type"
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('updatedAt') && (
        <DateFilter
          column={table.getColumn('updatedAt')}
          title="Updated Range"
          config={{
            mode: 'range',
            maxDate: new Date().fp_incr?.(1)
          }}
        />
      )}

      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          Apply Filters
        </Button>
        <Button
          onClick={onClearFilters}
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!isFiltered}>
          Reset
        </Button>
      </div>
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  pageTitle: PropTypes.string,
  summary: PropTypes.shape({
    totalTemplates: PropTypes.number,
    activeTemplates: PropTypes.number,
    draftTemplates: PropTypes.number
  }),
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};

SearchInput.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
