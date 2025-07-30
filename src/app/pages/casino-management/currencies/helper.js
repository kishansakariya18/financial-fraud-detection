export const status = [
  {
    value: true,
    label: 'Active'
  },
  {
    value: false,
    label: 'Inactive'
  }
];

export const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Code',
    accessor: 'code'
  },
  {
    Header: 'Games',
    accessor: 'games_count'
  },
  // {
  //   Header: 'Status',
  //   accessor: 'is_active',
  //   Cell: ({ value }) => {
  //     return (
  //       <div className="flex items-center">
  //         {value ? (
  //           <CheckBadgeIcon className="h-5 w-5 text-green-500" />
  //         ) : (
  //           <XCircleIcon className="h-5 w-5 text-red-500" />
  //         )}
  //         <span className="ml-2 text-sm font-medium text-gray-500">
  //           {value ? 'Active' : 'Inactive'}
  //         </span>
  //       </div>
  //     );
  //   }
  // },
  {
    Header: 'Action',
    accessor: 'action'
  }
];
