// Import Dependencies
import clsx from 'clsx';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export function Toolbar({ table, pageTitle = '' }) {
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
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object
};
