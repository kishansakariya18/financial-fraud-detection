// Import Dependencies
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { useNavigate } from 'react-router';
import { campaignStatusOptions } from '../helper';
import { DashboardCard } from 'components/custom/DashboardCard';

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
          onClick={() => navigate('/bonus-campaign/create')}>
          <PlusIcon className="size-5" />
          <span>{t('create') + ' ' + t('bonusCampaign')}</span>
        </Button>
      </div>
      {summary && (
        <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-3">
          <DashboardCard
            label="Total Campaigns"
            value={summary.totalCampaigns || 0}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-700"
            textColor="text-blue-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label="Active Campaigns"
            value={summary.activeCampaigns || 0}
            gradientFrom="from-green-500"
            gradientTo="to-green-700"
            textColor="text-green-100"
            maskShape="is-reuleaux-triangle"
          />
          <DashboardCard
            label="Total Redemptions"
            value={summary.totalRedemptions || 0}
            gradientFrom="from-purple-500"
            gradientTo="to-purple-700"
            textColor="text-purple-100"
            maskShape="is-reuleaux-triangle"
          />
        </div>
      )}
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
      value={table?.getColumn('campaignName')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('campaignName').setFilterValue(e.target.value)}
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
      placeholder={t('search')}
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={campaignStatusOptions}
          column={table.getColumn('status')}
          title={t('status')}
          Icon={FunnelIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('dateCreated') && (
        <DateFilter
          column={table.getColumn('dateCreated')}
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
