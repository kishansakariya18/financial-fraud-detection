// Import Dependencies
import { Input, Select } from '../../../../components/form';
import { status } from '../helper';

const CurrencyFilters = ({ filter, setFilter, handleFilter }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Input
        label="Search"
        name="search"
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleFilter();
          }
        }}
      />
      <Select
        label="Status"
        name="is_active"
        options={status}
        value={filter.is_active}
        onChange={(e) => setFilter({ ...filter, is_active: e })}
      />
    </div>
  );
};

export default CurrencyFilters;
