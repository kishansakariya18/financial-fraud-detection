// Import Dependencies
import { Input } from '../../../../components/form';

const CountryFilters = ({ filter, setFilter, handleFilter }) => {
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
    </div>
  );
};

export default CountryFilters;
