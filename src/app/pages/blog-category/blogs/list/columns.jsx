// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from '../../../../components/custom/table/cell';
import { featuredOptions, statusOptions } from '../helper';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    label: 'Blog ID',
    header: 'Blog ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.title, {
    id: 'title',
    label: 'Title',
    header: 'Title',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.slug, {
    id: 'slug',
    label: 'Slug',
    header: 'Slug',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.categoryName, {
    id: 'categoryName',
    label: 'Category',
    header: 'Category',
    cell: BoldCell,
    enableSorting: false,
    filterFn: (row, columnId, value) => {
      if (value === undefined || value === null || value === '') {
        return true;
      }

      return Number(row.original.blogCategoryId) === Number(value);
    }
  }),
  columnHelper.accessor((row) => row.authorName, {
    id: 'authorName',
    label: 'Author',
    header: 'Author',
    cell: BoldCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.isFeatured, {
    id: 'isFeatured',
    label: 'Featured',
    header: 'Featured',
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span
          className={`rounded px-2 py-1 text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    },
    enableSorting: false,
    filterFn: (row, columnId, value) => {
      if (value === undefined || value === null) {
        return true;
      }

      return row.original.isFeatured === value;
    },
    meta: { optionData: featuredOptions }
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    label: 'Status',
    header: 'Status',
    cell: BadgeCell,
    meta: { optionData: statusOptions },
    filterFn: 'arrIncludesSome',
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.viewCount, {
    id: 'viewCount',
    label: 'Views',
    header: 'Views',
    cell: ({ getValue }) => getValue() || 0,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    label: 'Created At',
    header: 'Created At',
    cell: DateCell,
    filterFn: 'inNumberRange',
    enableSorting: false
  }),
  columnHelper.display({
    id: 'actions',
    label: 'Row Actions',
    header: 'Actions',
    cell: RowActions,
    enableSorting: false
  })
];
