// Import Dependencies
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router';

// Local Imports
import { Avatar, AvatarDot, Button } from 'components/ui';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const logoutHandler = (e) => {
    e.preventDefault();
    toast.success(t('logout_success'));
    dispatch(AuthAction.logout());
    localStorage.removeItem(LOCAL_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE.IS_MASTER_ADMIN);
    localStorage.removeItem(LOCAL_STORAGE.PERMISSIONS);
    localStorage.removeItem(LOCAL_STORAGE.AUTH_PASSWORD);
    localStorage.removeItem(LOCAL_STORAGE.AUTH_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE.SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE.TWO_STEP_MODE);
    setTimeout(() => {
      navigate('/login');
    }, 0);
  };

  const userData = useSelector((data) => data.auth.userData);

  return (
    <Popover className="relative flex">
      <PopoverButton
        as={Avatar}
        size={9}
        role="button"
        name={userData?.FirstName + ' ' + userData?.LastName}
        src={null}
        indicator={<AvatarDot color="success" className="-m-0.5 size-3 ltr:right-0 rtl:left-0" />}
      />
      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-y-2 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-2 opacity-0">
        <PopoverPanel
          anchor={{ to: 'bottom end', gap: 12 }}
          className="z-[70] flex w-64 flex-col rounded-lg border border-gray-150 bg-white shadow-soft transition dark:border-dark-600 dark:bg-dark-700 dark:shadow-none">
          {({ close }) => (
            <>
              <div className="flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5 dark:bg-dark-800">
                <Avatar
                  size={14}
                  src={null}
                  name={userData?.FirstName + ' ' + userData?.LastName}
                />
                <div>
                  <Link
                    className="text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
                    onClick={close}>
                    {userData?.FirstName + ' ' + userData?.LastName}
                  </Link>

                  <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                    {userData?.Username}
                  </p>
                </div>
              </div>
              <div className="flex flex-col pb-5 pt-2">
                <div className="px-4 pt-4">
                  <Button className="w-full gap-2" onClick={logoutHandler}>
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
