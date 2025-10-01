// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { t } from 'i18next';

// Local Imports
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { referredTxnPlanTypeOptions, referredTxnStatusOptions } from './helper';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useParams } from 'react-router';
import { HiOutlineCash, HiOutlineTicket } from 'react-icons/hi';

// ----------------------------------------------------------------------

export function Toolbar({
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const { affiliateId, campaignID } = useParams();

  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('campaign') + ' ' + t('list'), path: `/affiliates/${affiliateId}/tab/campaigns` },
    {
      title: t('referred_users'),
      path: `/affiliates/${affiliateId}/tab/campaigns/${campaignID}/referred_users`
    },
    { title: t('transactions') }
  ];

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
          style={{ '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)' }}>
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
      value={table?.getColumn('username')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('username').setFilterValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onApplyFilters();
      }}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
      placeholder={t('search_desc')}
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // Build currency options from current table data
  const buildCurrencyOptions = () => {
    try {
      const rows = table?.getRowModel?.()?.rows || [];
      const map = new Map();
      for (const r of rows) {
        const cur = r?.original?.currency;
        if (cur?.id && !map.has(String(cur.id))) {
          map.set(String(cur.id), {
            value: String(cur.id),
            label: cur.code || String(cur.id)
          });
        }
      }
      return Array.from(map.values());
    } catch {
      return [];
    }
  };
  return (
    <>
      {table.getColumn('planType') && (
        <FacedtedFilter
          options={referredTxnPlanTypeOptions}
          column={table.getColumn('planType')}
          title={t('type')}
          Icon={HiOutlineTicket}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('status') && (
        <FacedtedFilter
          options={referredTxnStatusOptions}
          column={table.getColumn('status')}
          title={t('status')}
          Icon={MapPinIcon}
          isMultiple={true}
          showCheckbox={false}
        />
      )}

      {table.getColumn('currencyID') && (
        <FacedtedFilter
          options={buildCurrencyOptions()}
          column={table.getColumn('currencyID')}
          title={t('currency')}
          Icon={HiOutlineCash}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('createdAt') && (
        <DateFilter
          column={table.getColumn('createdAt')}
          title={t('date') + ' ' + t('range')}
          config={{ maxDate: new Date().fp_incr(1), mode: 'range' }}
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

Toolbar.propTypes = {
  table: PropTypes.object,
  pageTitle: PropTypes.string,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
SearchInput.propTypes = { table: PropTypes.object, onApplyFilters: PropTypes.func };
Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
