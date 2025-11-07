// Import Dependencies
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { t } from 'i18next';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Local Imports
import { Button, Input } from 'components/ui';
import { ExportCSV } from 'components/custom/export';
import { getQueryParams } from 'utils/custom.utilities';
import apiConfig from 'configs/api.config';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import {
  statusOptions,
  agentTypeOptions,
  parseAgentStatusToApi,
  parseAgentTypeToApi
} from 'components/sections/b2b-agents/helper';
import moment from 'moment-timezone';

// ----------------------------------------------------------------------

export function AgentWalletFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [searchParams] = useSearchParams();

  const filters = getQueryParams(searchParams);

  const exportFilters = useMemo(() => {
    const params = {};

    if (filters.agentName) {
      params.keyword = filters.agentName;
    }
    if (filters.agentID) {
      params.agentID = filters.agentID;
    }
    if (filters.status) {
      params.status = parseAgentStatusToApi(filters.status);
    }
    if (filters.agentType) {
      params.agentType = parseAgentTypeToApi(filters.agentType);
    }
    if (filters.startDate && filters.endDate) {
      params.startDate = moment(Number(filters.startDate)).startOf('day').toDate();
      params.endDate = moment(Number(filters.endDate)).endOf('day').toDate();
    }

    params.export = true;

    return params;
  }, [filters]);

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
        <ExportCSV
          validateFilters={null}
          requestFilters={exportFilters}
          requestMethod="get"
          apiEndpoint={apiConfig.endPoints.B2B_AGENT.WALLET.AGENT_WALLET_REPORT}
        />
      </div>
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
          <Filters table={table} onApplyFilters={onApplyFilters} onClearFilters={onClearFilters} />
        </div>
        <TableConfig table={table} />
      </div>
    </div>
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn('status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('agentType') && (
        <FacedtedFilter
          options={agentTypeOptions}
          column={table.getColumn('agentType')}
          title="Agent Type"
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

function SearchInput({ table, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn('agentName')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('agentName').setFilterValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onApplyFilters?.();
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

AgentWalletFilters.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  pageTitle: PropTypes.string
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};
