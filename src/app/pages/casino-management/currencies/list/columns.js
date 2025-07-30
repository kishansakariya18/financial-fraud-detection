//import RowActions from './RowActions';

export const columns = [
  {
    header: 'ID',
    accessorKey: 'id'
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Code',
    accessorKey: 'code'
  },
  {
    header: 'Symbol',
    accessorKey: 'symbol'
  },
  {
    header: 'Games',
    accessorKey: 'games_count'
  }
  // {
  //   header: 'Action',
  //   accessorKey: 'action',
  //   cell: ({ row }) => <RowActions id={row.original._id} item={row.original} />
  // }
];
