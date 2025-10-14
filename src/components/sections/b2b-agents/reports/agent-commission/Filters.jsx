// Import Dependencies
import { MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { t } from 'i18next';

// Local Imports
import { Button } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { ExportCSV } from 'components/custom/export';
import { getQueryParams } from 'utils/custom.utilities';
import apiConfig from 'configs/api.config';
import moment from 'moment';
import { commissionTypeOptions } from './helper';

// ----------------------------------------------------------------------

export function AgentCommissionFilters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [searchParams] = useSearchParams();

  const filters = getQueryParams(searchParams);

  const exportFilters = useMemo(() => {
    const params = {};

    if (filters.startDate) {
      params.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      params.endDate = moment(+filters.endDate).endOf('day').toDate();
    }
    if (filters.agentName) {
      params.agentName = filters.agentName;
    }
    if (filters.commissionType) {
      params.commissionType = filters.commissionType;
    }
    if (filters.agentId) {
      params.agentId = filters.agentId;
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
          filters={{ startDate: filters.startDate, endDate: filters.endDate }}
          requestFilters={exportFilters}
          requestMethod="get"
          apiEndpoint={apiConfig.endPoints.B2B_AGENT.WALLET.AGENT_COMMISSION_REPORT}
        />
      </div>
      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
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

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {table.getColumn('commissionType') && (
        <FacedtedFilter
          options={commissionTypeOptions}
          column={table.getColumn('commissionType')}
          title="Commission Type"
          Icon={MapPinIcon}
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

AgentCommissionFilters.propTypes = {
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
