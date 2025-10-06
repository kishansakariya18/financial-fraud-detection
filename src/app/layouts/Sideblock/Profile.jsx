// Import Dependencies
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router';
import { useMemo } from 'react';

// Local Imports
import { Avatar, AvatarDot, Button } from 'components/ui';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TbUser } from 'react-icons/tb';
import apiConfig from 'configs/api.config';
import AuthService from 'services/auth.services';

import AgentAuthService from 'services/b2b-agent/agent-auth.services';

const links = [
  {
    id: '1',
    title: 'Profile',
    description: 'Your profile Setting',
    to: '/profile/change-profile',
    Icon: TbUser,
    color: 'warning'
  }
];

export function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAgentuser = useMemo(() => !!userData?.AgentID, [userData?.AgentID]);

  const { t } = useTranslation();
  const logoutHandler = (e) => {
    e.preventDefault();
    let res = null;
    dispatch(AuthAction.logout());
    localStorage.removeItem(LOCAL_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE.IS_MASTER_ADMIN);
    localStorage.removeItem(LOCAL_STORAGE.PERMISSIONS);
    localStorage.removeItem(LOCAL_STORAGE.AUTH_PASSWORD);
    localStorage.removeItem(LOCAL_STORAGE.AUTH_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE.SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE.TWO_STEP_MODE);
    toast.success(t('logout_success'));

    setTimeout(() => {
      navigate(isAgentuser ? '/agent-auth/login' : '/login');
    }, 0);
    if (isAgentuser) {
      res = AgentAuthService.logout();
    } else {
      res = AuthService.logout();
    }
    res
      .then(() => {
        //no action
      })
      .catch((error) => {
        console.error('Logout Error: ', error);
        //no action
      });
  };

  return (
    <Popover className="relative flex">
      <PopoverButton
        as={Avatar}
        size={9}
        role="button"
        name={userData?.FirstName + ' ' + userData?.LastName}
        src={userData?.ImageName ? `${apiConfig.baseURL.S3_URL}/admin/${userData.ImageName}` : null}
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
                  src={
                    userData?.ImageName
                      ? `${apiConfig.baseURL.S3_URL}/admin/${userData.ImageName}`
                      : null
                  }
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
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.to}
                    onClick={close}
                    className="group flex items-center gap-3 px-4 py-2 tracking-wide outline-none transition-all hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-600 dark:focus:bg-dark-600">
                    <Avatar
                      size={8}
                      initialColor={link.color}
                      classNames={{ display: 'rounded-lg' }}>
                      <link.Icon className="size-4.5" />
                    </Avatar>
                    <div>
                      <h2 className="font-medium text-gray-800 transition-colors group-hover:text-primary-600 group-focus:text-primary-600 dark:text-dark-100 dark:group-hover:text-primary-400 dark:group-focus:text-primary-400">
                        {link.title}
                      </h2>
                      <div className="truncate text-xs text-gray-400 dark:text-dark-300">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Button className="w-full gap-2" onClick={logoutHandler}>
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>{t('logout')}</span>
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
