export const dummyData = [
  {
    id: 1,
    fromRate: '0.92',
    toRate: '1.08',
    currency: 'USD',
    amount: 1000,
    date: new Date('2023-10-01T10:00:00Z').getTime()
  },
  {
    id: 2,
    fromRate: '1.08',
    toRate: '1.22',
    currency: 'USD',
    amount: 500,
    date: new Date('2023-10-02T11:30:00Z').getTime()
  },
  {
    id: 3,
    fromRate: '1.22',
    toRate: '1.22',
    currency: 'USD',
    amount: 750,
    date: new Date('2023-10-03T14:00:00Z').getTime()
  },
  {
    id: 4,
    fromRate: '149.8',
    toRate: '149.8',
    currency: 'USD',
    amount: 2000,
    date: new Date('2023-10-04T09:00:00Z').getTime()
  },
  {
    id: 5,
    fromRate: '0.63',
    toRate: '1.22',
    currency: 'USD',
    amount: 1200,
    date: new Date('2023-10-05T16:45:00Z').getTime()
  }
];

export const exchangeHistoryListResponseMapper = (response) => {
  if (!response || !response.data) {
    return { list: [], totalRecords: 0, totalPages: 1 };
  }

  return {
    list: response.data,
    totalRecords: response.total_records || response.data.length,
    totalPages: response.total_pages || 1
  };
};
