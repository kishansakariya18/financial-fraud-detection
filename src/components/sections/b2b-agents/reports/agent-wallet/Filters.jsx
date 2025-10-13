// Import Dependencies
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { t } from 'i18next';

// Local Imports
import { Button } from 'components/ui';
import { ExportCSV } from 'components/custom/export';
import { getQueryParams } from 'utils/custom.utilities';
import apiConfig from 'configs/api.config';

// ----------------------------------------------------------------------

export function AgentWalletFilters({
  table,
  // onApplyFilters = () => {},
  // onClearFilters = () => {},
  pageTitle = ''
}) {
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [searchParams] = useSearchParams();

  const filters = getQueryParams(searchParams);

  const exportFilters = useMemo(() => {
    const params = {};

    if (filters.agentName) {
      params.agentName = filters.agentName;
    }
    if (filters.agentID) {
      params.agentID = filters.agentID;
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
      {/* {isXs ? (
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
      )} */}
    </div>
  );
}

// function SearchInput({ table, onApplyFilters }) {
//   return (
//     <Input
//       value={table?.getColumn('agentName')?.getFilterValue() || ''}
//       onChange={(e) => table.getColumn('agentName').setFilterValue(e.target.value)}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter') {
//           onApplyFilters();
//         }
//       }}
//       prefix={<MagnifyingGlassIcon className="size-4" />}
//       classNames={{
//         input: 'h-8 text-xs ring-primary-500/50 focus:ring',
//         root: 'shrink-0'
//       }}
//       placeholder="Search Agent Name . . ."
//     />
//   );
// }

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
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!isFiltered}>
          {t('reset') + ' ' + t('filter')}
        </Button>
      </div>
    </>
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
