// Import Dependencies
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import clsx from 'clsx';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { TableConfig } from 'components/ui/custom/TableConfig';
import PropTypes from 'prop-types';
import { t } from 'i18next';
// ----------------------------------------------------------------------

export function Toolbar({ table, pageTitle = '' }) {
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const { isXs } = useBreakpointsContext();
  const breadcrumbItem = [
    { title: t('affiliate'), path: '/users/affiliate' },
    { title: t('login') + ' ' + t('history') }
  ];
  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
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

Toolbar.propTypes = {
  table: PropTypes.object
};
