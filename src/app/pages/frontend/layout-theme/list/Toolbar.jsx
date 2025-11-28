// Import Dependencies
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Local Imports
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
export function Toolbar({ table, pageTitle = '' }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

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

        <div>
          {hasPermission(PERMISSIONS.LAYOUTS.ADD) && (
            <Button
              className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
              color="primary"
              onClick={() => navigate('/layout/layout-theme/create')}>
              <PlusIcon className="size-5" />
              <span>{t('add') + ' ' + t('layoutTheme')}</span>
            </Button>
          )}
        </div>
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            {/* <SearchInput table={table} /> */}
            <TableConfig table={table} />
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
          <div></div>
          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table?.getColumn('gameName')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('gameName').setFilterValue(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder={t('search') + ' ' + t('games') + ' ...'}
    />
  );
}

Toolbar.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object
};
