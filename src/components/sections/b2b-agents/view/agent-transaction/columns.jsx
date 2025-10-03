import { createColumnHelper } from '@tanstack/react-table';

import { RowActions } from './RowActions';
import { IdCell, DateCell, BoldCell, BadgeCell } from 'components/custom/table/cell';
import { agentTransactionTypeOptions, creditDebitTypeOptions } from '../../helper';
import { useCurrencyContext } from 'app/contexts/currency/context';

const columnHelper = createColumnHelper();

export const AgentTransactionColumns = () => {
  const { formatCurrency } = useCurrencyContext();
  return [
    columnHelper.accessor((row) => row.id, {
      id: 'id',
      label: 'Transaction ID',
      header: 'Transaction ID',
      cell: IdCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.agentWalletTransactionID, {
      id: 'agentWalletTransactionID',
      label: 'Wallet Txn ID',
      header: 'Wallet Txn ID',
      cell: BoldCell,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.transactionType, {
      id: 'transactionType',
      label: 'Transaction Type',
      header: 'Transaction Type',
      cell: BadgeCell,
      meta: { optionData: agentTransactionTypeOptions },
      filterFn: 'equals',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.amount, {
      id: 'amount',
      header: 'Amount',
      label: 'Amount',
      cell: ({ row }) => {
        const amount = row.original.amount || 0;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.creditDebitType, {
      id: 'creditDebitType',
      label: 'Credit/Debit',
      header: 'Credit/Debit',
      cell: BadgeCell,
      meta: { optionData: creditDebitTypeOptions },
      filterFn: 'equals',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.openingBalance, {
      id: 'openingBalance',
      header: 'Opening Balance',
      label: 'Opening Balance',
      cell: ({ row }) => {
        const amount = row.original.openingBalance || 0;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.closingBalance, {
      id: 'closingBalance',
      header: 'Closing Balance',
      label: 'Closing Balance',
      cell: ({ row }) => {
        const amount = row.original.closingBalance || 0;
        return <div className="font-medium">{formatCurrency(amount)}</div>;
      },
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.referenceID, {
      id: 'referenceID',
      header: 'Reference ID',
      label: 'Reference ID',
      cell: ({ row }) => {
        const refId = row.original.referenceID;
        return <div className="font-mono text-xs">{refId || '-'}</div>;
      },
      filterFn: 'includesString',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: 'createdAt',
      label: 'Date',
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
};
