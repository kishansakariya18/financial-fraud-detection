export const transactionRoute = [
  {
    path: 'transactions',
    lazy: async () => {
      const { default: TransactionsList } = await import('../../pages/transactions/list');
      return {
        Component: () => <TransactionsList />
      };
    }
  },
  {
    path: 'transactions/create',
    lazy: async () => {
      const { default: CreateTransaction } =
        await import('../../pages/transactions/CreateTransaction');
      return {
        Component: () => <CreateTransaction />
      };
    }
  }
];

export default transactionRoute;
