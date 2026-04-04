/*export const transactionRoute = [
  {
    path: '/dashboards/transactions',
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
*/
/*
import CreateTransaction from 'app/pages/transactions/CreateTransaction';
import TransactionList from 'app/pages/transactions/list';

export const transactionRoute = [
  {
    path: '/dashboards/transactions', // ✅ FIXED
    lazy: async () => {
      const { default: TransactionsList } = await import('../../pages/transactions/list');
      return {
        Component: () => <TransactionsList />
      };
    }
  },
  {
    path: '/dashboard/transactions/create', // ✅ FIXED
    lazy: async () => {
      const { default: CreateTransaction } =
        await import('../../pages/transactions/CreateTransaction');
      return {
        Component: () => <CreateTransaction />
      };
    }
  },
  {
    path: 'transactions',
    children: [
      {
        path: '',
        element: <TransactionList /> // list.jsx
      },
      {
        path: 'create', // ✅ THIS IS MISSING IN YOUR APP
        element: <CreateTransaction />
      }
    ]
  }
];

export default transactionRoute;
*/
export const transactionRoute = [
  {
    path: 'dashboards/transactions', // ✅ parent route
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: TransactionsList } = await import('../../pages/transactions/list');
          return {
            Component: TransactionsList
          };
        }
      },
      {
        path: 'create', // ✅ FINAL CREATE PATH
        lazy: async () => {
          const { default: CreateTransaction } =
            await import('../../pages/transactions/CreateTransaction');

          return {
            Component: CreateTransaction
          };
        }
      }
    ]
  }
];

export default transactionRoute;
