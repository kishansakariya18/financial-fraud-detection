export const currencyListResponseMapper = (response) => {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return { list: [], total_records: 0 };
  }

  const mappedData = response.data.map((d) => ({
    id: d.CurrencyID,
    name: d.Name,
    code: d.Code,
    symbol: d.Symbol,
    decimal_places: d.DecimalPlaces,
    type: d.CurrencyType === 0 ? 'Fiat' : 'Crypto',
    status: d.IsActive ? 'active' : 'inactive',
    exchangeUpdateType: d.ExchangeUpdateType === 0 ? 'Manual' : 'Auto',
    is_default: d.IsDefault,
    created_at: d.DateCreated,
    updated_at: d.DateUpdated
  }));

  return {
    list: mappedData,
    total_records: response.total_records
  };
};

export const statusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success'
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error'
  }
];

export const exchangeUpdateTypeOptions = [
  {
    value: 'Manual',
    label: 'Manual',
    color: 'success'
  },
  {
    value: 'Auto',
    label: 'Auto',
    color: 'error'
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
