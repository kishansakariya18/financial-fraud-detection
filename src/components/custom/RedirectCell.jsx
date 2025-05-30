// Import Dependencies
import PropTypes from 'prop-types';

// Local Imports
import { Link } from 'react-router';

// ----------------------------------------------------------------------

export function RedirectCell({ getValue, column }) {
  const val = getValue();
  const optionData = column.columnDef.meta?.optionData;
  const link = optionData?.link || '#';

  return (
    <div className="flex space-x-1 rtl:space-x-reverse">
      <Link to={link}>
        <span>{val}</span>
      </Link>
    </div>
  );
}

RedirectCell.propTypes = {
  getValue: PropTypes.func,
  table: PropTypes.object,
  highlight: PropTypes.bool
};
