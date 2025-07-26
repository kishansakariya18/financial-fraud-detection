import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { blockedProviderStatusOptions } from '../helper';
import { useTranslation } from 'react-i18next';

export function BlockedProvidersFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const { t } = useTranslation();
  const { isXs } = useBreakpointsContext();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="table-toolbar">
      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              'px-[--margin-x]'
            )}>
            <SearchInput table={table} t={t} onApplyFilters={onApplyFilters} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              'hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
              'px-[--margin-x]'
            )}>
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              t={t}
              isFiltered={isFiltered}
            />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            'custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
            'px-[--margin-x]'
          )}
          style={{
            '--margin-scroll': 'var(--margin-x)'
          }}>
          <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
            <SearchInput table={table} t={t} onApplyFilters={onApplyFilters} />
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
              t={t}
              isFiltered={isFiltered}
            />
          </div>
          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table, t, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn('providerName')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('providerName').setFilterValue(e.target.value)}
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
      placeholder={t('searchProviderName') || 'Search Provider Name...'}
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {}, t, isFiltered }) {
  return (
    <>
      {table.getColumn('isBlocked') && (
        <FacedtedFilter
          options={blockedProviderStatusOptions}
          column={table.getColumn('isBlocked')}
          title={t('status') || 'Blocked Status'}
          isMultiple={false}
          showCheckbox={false}
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

BlockedProvidersFilters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};

SearchInput.propTypes = {
  table: PropTypes.object,
  t: PropTypes.func,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  t: PropTypes.func,
  isFiltered: PropTypes.bool
};
