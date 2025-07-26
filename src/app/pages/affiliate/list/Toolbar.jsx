// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { affiliateStatusOptions } from '../helper';
import { useNavigate } from 'react-router';
import { DashboardCard } from 'components/custom/DashboardCard';
import { dummyCards } from 'helpers/functions';

// ----------------------------------------------------------------------

export function Toolbar({
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {},
  summary = null
}) {
  const { isXs } = useBreakpointsContext();
  const navigate = useNavigate();
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

        <Button
          className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
          color="primary"
          onClick={() => navigate('/users/affiliate/create')}>
          <PlusIcon className="size-5" />
          <span>{t('create') + ' ' + t('affiliate')}</span>
        </Button>
      </div>
      <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
        <DashboardCard
          label={dummyCards.Affiliate.TOTAL_AFFILIATE.key}
          value={summary ? summary.totalAffiliates : dummyCards.Affiliate.TOTAL_AFFILIATE.value}
          gradientFrom={dummyCards.Affiliate.TOTAL_AFFILIATE.gradientFrom}
          gradientTo={dummyCards.Affiliate.TOTAL_AFFILIATE.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Affiliate.TOTAL_SIGNUP_USERS.key}
          value={summary ? summary.totalSignups : dummyCards.Affiliate.TOTAL_SIGNUP_USERS.value}
          gradientFrom={dummyCards.Affiliate.TOTAL_SIGNUP_USERS.gradientFrom}
          gradientTo={dummyCards.Affiliate.TOTAL_SIGNUP_USERS.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Affiliate.TOTAL_DEPOSITS.key}
          value={summary ? summary.totalDeposits : dummyCards.Affiliate.TOTAL_DEPOSITS.value}
          gradientFrom={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientFrom}
          gradientTo={dummyCards.Affiliate.TOTAL_DEPOSITS.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.Affiliate.TOTAL_COMMISSION.key}
          value={summary ? summary.totalCommissions : dummyCards.Affiliate.TOTAL_COMMISSION.value}
          gradientFrom={dummyCards.Affiliate.TOTAL_COMMISSION.gradientFrom}
          gradientTo={dummyCards.Affiliate.TOTAL_COMMISSION.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
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

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={affiliateStatusOptions}
          column={table.getColumn('status')}
          title={t('status')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('createdAt') && (
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

Toolbar.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object
};
