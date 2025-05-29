// Import Dependencies
import clsx from 'clsx';

// Local Imports
import { LanguageSelector } from 'components/template/LaguageSelector';
import { SidebarToggleBtn } from 'components/shared/SidebarToggleBtn';
import { Profile } from '../Profile';
import { useThemeContext } from 'app/contexts/theme/context';
import { Button } from '@headlessui/react';
import { RiRobot2Line } from 'react-icons/ri';
import apiConfig from 'configs/api.config';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
// import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

// ----------------------------------------------------------------------

export function Header() {
  const { cardSkin } = useThemeContext();
  const { hasPermission } = usePermissions();
  // `${apiConfig.baseURL.AI_CHAT_URL}?token=${token}
  const token = localStorage.getItem('AuthToken');
  return (
    <header
      className={clsx(
        'app-header transition-content sticky top-0 z-20 flex h-[65px] items-center gap-1 border-b border-gray-200 bg-white/80 px-[--margin-x] backdrop-blur backdrop-saturate-150 dark:border-dark-600 max-sm:justify-between',
        cardSkin === 'bordered' ? 'dark:bg-dark-900/80' : 'dark:bg-dark-700/80'
      )}>
      <div className="contents xl:hidden">
        <SidebarToggleBtn />
      </div>

      {hasPermission(PERMISSIONS.BUX_AI.VIEW) && (
        <div className="flex items-center gap-3 sm:flex-1">
          <div className="flex-1"></div>
          <Button
            unstyled
            onClick={() => window.open(`${apiConfig.baseURL.AI_CHAT_URL}?token=${token}`)}
            className="gap-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-600 px-5 py-2 text-xs+ text-white duration-100 ease-out [contain:paint] hover:opacity-[.85] focus:opacity-[.85] active:translate-y-px">
            <div className="flex gap-2">
              <RiRobot2Line className="size-5" />
              <span className="max-sm:hidden">Try Bux AI</span>
            </div>
          </Button>
          <LanguageSelector />
          <Profile />
        </div>
      )}
    </header>
  );
}
