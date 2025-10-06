// Import Dependencies
import { useTranslation } from 'react-i18next';
import { CreateDisposableEmail } from './CreateDomain';
import PropTypes from 'prop-types';
import { Button, Input } from 'components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TableConfig } from 'components/ui/custom/TableConfig';
import clsx from 'clsx';
// ----------------------------------------------------------------------

export function DisposableEmailToolbar({
  table,
  searchValue,
  setSearchValue,
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const handleInputChange = (e) => setSearchValue(e.target.value);

  const handleReset = () => {
    setSearchValue('');
    onClearFilters();
  };

  const { t } = useTranslation();
  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {t('disposable') + ' ' + t('email')}
          </h2>
        </div>
        <CreateDisposableEmail tableFetch={table.options.meta?.fetchNewList} />
      </div>
      <div className={`flex items-center justify-between gap-4 px-[--margin-x] pb-4 pt-4`}>
        <div className="flex space-x-2">
          <Input
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onApplyFilters();
              }
            }}
            prefix={<MagnifyingGlassIcon className="size-4" />}
            className="max-w-xs"
            classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
            placeholder={t('search') + 'emailDomain'}
          />
          <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
            {t('search')}
          </Button>
          <Button
            onClick={handleReset}
            className="h-8 whitespace-nowrap px-2.5 text-xs"
            disabled={!searchValue}>
            {t('reset') + ' ' + t('filter')}
          </Button>
        </div>
        <div className="ml-auto">
          <TableConfig table={table} />
        </div>
      </div>
    </div>
  );
}

DisposableEmailToolbar.propTypes = {
  table: PropTypes.object,
  isFullScreenEnabled: PropTypes.bool
};
