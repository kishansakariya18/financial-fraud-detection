// Import Dependencies
import { createColumnHelper } from '@tanstack/react-table';

// Local Imports
import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';
import { TRANSACTION_TYPES, PAYMENT_METHODS, FRAUD_STATUS } from './constants';
import { getTransactionCategoryLabel } from './transactionCategoryLabel';

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row._id, {
    id: 'id',
    label: 'ID',
    header: 'ID',
    cell: IdCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.categoryId, {
    id: 'category',
    label: 'Category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="font-medium">{getTransactionCategoryLabel(row.original)}</div>
    ),
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.transactionDate, {
    id: 'transactionDate',
    label: 'Date',
    header: 'Transaction Date',
    cell: DateCell,
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.paymentMethod, {
    id: 'paymentMethod',
    label: 'Payment Method',
    header: 'Payment Method',
    cell: ({ row }) => {
      const pm = row.original.paymentMethod;
      const method = PAYMENT_METHODS.find((m) => m.value === pm);
      return <div className="font-medium">{method?.label || pm}</div>;
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fraudStatus, {
    id: 'fraudStatus',
    label: 'Fraud Status',
    header: 'Fraud Status',
    cell: BadgeCell,
    meta: { optionData: FRAUD_STATUS },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.fraudScore, {
    id: 'fraudScore',
    label: 'Fraud Score',
    header: 'Fraud Score',
    cell: ({ row }) => {
      const score = row.original.fraudScore;
      let color = 'text-gray-600';
      if (score > 80) color = 'text-red-600 font-bold';
      else if (score > 50) color = 'text-orange-600 font-bold';
      else if (score > 20) color = 'text-yellow-600 font-bold';
      else color = 'text-green-600 font-bold';

      return <div className={color}>{score}</div>;
    },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    label: 'Type',
    header: 'Type',
    cell: BadgeCell,
    meta: { optionData: TRANSACTION_TYPES },
    enableSorting: false
  }),
  columnHelper.accessor((row) => row.amount, {
    id: 'amount',
    label: 'Amount',
    header: 'Amount',
    cell: BoldCell,
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
