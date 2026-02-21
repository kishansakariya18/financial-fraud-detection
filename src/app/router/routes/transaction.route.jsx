export const transactionRoute = [
  {
    path: 'transactions',
    lazy: async () => {
      const { default: TransactionsList } = await import('../../pages/transactions/list');
      return {
        Component: () => <TransactionsList />
      };
    }
  }
];

export default transactionRoute;
