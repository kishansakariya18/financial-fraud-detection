// Import Dependencies
import clsx from "clsx";

// Local Imports
import { LanguageSelector } from "components/template/LaguageSelector";
import { SidebarToggleBtn } from "components/shared/SidebarToggleBtn";
import { Profile } from "../Profile";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function Header() {
  const { cardSkin } = useThemeContext();

  return (
    <header
      className={clsx(
        "app-header transition-content sticky top-0 z-20 flex h-[65px] items-center gap-1 border-b border-gray-200 bg-white/80 px-[--margin-x] backdrop-blur backdrop-saturate-150 dark:border-dark-600 max-sm:justify-between",
        cardSkin === "bordered" ? "dark:bg-dark-900/80" : "dark:bg-dark-700/80",
      )}
    >
      <div className="contents xl:hidden">
        <SidebarToggleBtn />
      </div>

      <div className="flex items-center gap-2 sm:flex-1">
        <div className="flex-1">
        </div>
        <LanguageSelector />
        <Profile />
      </div>
    </header>
  );
}
