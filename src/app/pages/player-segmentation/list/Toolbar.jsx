import PropTypes from 'prop-types';
import { TableToolbar } from 'components/shared/table/TableToolbar';

/**
 * Player Segmentation Toolbar
 * Wrapper around the reusable TableToolbar component
 */
export function Toolbar(props) {
  return <TableToolbar {...props} />;
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  pageTitle: PropTypes.string,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  searchColumn: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  createButton: PropTypes.shape({
    show: PropTypes.bool,
    permission: PropTypes.string,
    route: PropTypes.string,
    text: PropTypes.string
  }),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['faceted', 'date']).isRequired,
      column: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      options: PropTypes.array,
      isMultiple: PropTypes.bool,
      showCheckbox: PropTypes.bool,
      config: PropTypes.object
    })
  )
};
