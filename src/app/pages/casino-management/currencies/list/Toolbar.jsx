import { useTranslation } from 'react-i18next';
import { Input } from 'components/ui';
import { HiOutlineSearch } from 'react-icons/hi';

export const Toolbar = ({ table, onApplyFilters, onClearFilters }) => {
  const { t } = useTranslation();

  const handleSearch = (e) => {
    const value = e.target.value;
    table.getColumn('Name')?.setFilterValue(value);
  };

  const searchValue = table.getColumn('Name')?.getFilterValue() || '';

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <Input
        className="max-w-md"
        size="sm"
        placeholder={t('search')}
        prefix={<HiOutlineSearch className="text-lg" />}
        value={searchValue}
        onChange={handleSearch}
      />
      <div className="flex items-center gap-2">
        <button className="btn btn-sm btn-primary" onClick={onApplyFilters}>
          {t('apply')}
        </button>
        <button className="btn btn-sm btn-default" onClick={onClearFilters}>
          {t('clear')}
        </button>
      </div>
    </div>
  );
};
