import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';

import { Button } from 'components/ui';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { AuthAction } from 'store/admin-slice/AuthSlice';

const tabs = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' }
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE.IS_MASTER_ADMIN);
    localStorage.removeItem(LOCAL_STORAGE.PERMISSIONS);
    localStorage.removeItem(LOCAL_STORAGE.AUTH_EMAIL);
    dispatch(AuthAction.logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-dark-50">Admin panel</h1>
              <p className="text-sm text-gray-500 dark:text-dark-400">
                {userData?.email ? `Signed in as ${userData.email}` : 'Fraud platform'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outlined"
                className="gap-2"
                onClick={() => navigate('/dashboards/home')}>
                <HomeIcon className="size-4" />
                User app
              </Button>
              <Button
                variant="flat"
                className="gap-2 text-red-600 dark:text-red-400"
                onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="size-4" />
                Log out
              </Button>
            </div>
          </div>

          <nav className="mt-4 flex gap-1 border-t border-gray-100 pt-3 dark:border-dark-600">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-dark-300 dark:hover:bg-dark-600'
                  )
                }>
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
