// Import Dependencies
import { useTranslation } from 'react-i18next';
import { CreateDisposableEmail } from './CreateDomain';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export function DisposableEmailToolbar({ table }) {
  const { t } = useTranslation();
  return (
    <div className="table-toolbar">
      <div className={`flex items-center justify-between gap-4 px-[--margin-x] pb-4 pt-4`}>
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {t('disposable') + ' ' + t('email')}
        </h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <CreateDisposableEmail tableFetch={table.options.meta?.fetchNewList} />
        </div>
      </div>
    </div>
  );
}

DisposableEmailToolbar.propTypes = {
  table: PropTypes.object,
  isFullScreenEnabled: PropTypes.bool
};
