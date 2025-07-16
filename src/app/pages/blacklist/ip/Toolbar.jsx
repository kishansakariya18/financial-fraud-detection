import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function Toolbar({
  onAdd,
  table,
  searchValue,
  setSearchValue,
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const handleInputChange = (e) => setSearchValue(e.target.value);
  const { t } = useTranslation();
  const pageTitle = t('blacklisted') + ' IP ' + t('address');
  const buttonTitle = t('blacklist') + ' IP ' + t('address');

  const handleReset = () => {
    setSearchValue('');
    onClearFilters();
  };

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
        </div>
        <Button
          className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
          color="primary"
          onClick={onAdd}>
          <PlusIcon className="size-5" />
          <span>{buttonTitle}</span>
        </Button>
      </div>
      <div className="flex items-center justify-between px-[--margin-x] pt-4">
        <div className="flex space-x-2">
          <Input
            value={searchValue}
            onChange={handleInputChange}
            prefix={<MagnifyingGlassIcon className="size-4" />}
            className="max-w-xs"
            classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
            placeholder={t('search') + ' IP ' + t('address')}
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

Toolbar.propTypes = {
  onAdd: PropTypes.func,
  table: PropTypes.object,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
