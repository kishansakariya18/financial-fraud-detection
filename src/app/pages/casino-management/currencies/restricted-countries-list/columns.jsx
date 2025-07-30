// Import Dependencies
import { TrashIcon } from '@heroicons/react/24/outline';

export const columns = [
  {
    Header: 'Country',
    accessor: 'country.name'
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: ({ row }) => (
      <button onClick={() => console.log('delete', row.original._id)}>
        <TrashIcon className="h-5 w-5 text-red-500" />
      </button>
    )
  }
];
