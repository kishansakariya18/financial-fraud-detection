// Import Dependencies
import PropTypes from 'prop-types';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

// Local Imports
import { AccordionButton, AccordionItem, AccordionPanel } from 'components/ui';
import { MenuItem } from './MenuItem';
import { useLocaleContext } from 'app/contexts/locale/context';
import usePermissions from 'app/router/usePermissions';

// ----------------------------------------------------------------------

export function CollapsibleItem({ data }) {
  const { path, transKey, Icon, childs } = data;
  const { t } = useTranslation();
  const { isRtl } = useLocaleContext();
  const { hasPermission } = usePermissions();

  const title = t(transKey) || data.title;
  const ChevronIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  console.log('id: ', path);

  return (
    <AccordionItem value={path} className="relative flex flex-1 flex-col px-3">
      {({ open }) => (
        <>
          <AccordionButton
            className={clsx(
              'group flex flex-1 items-center justify-between rounded-lg px-3 py-2 font-medium outline-none transition-colors duration-300 ease-in-out',
              open
                ? 'text-gray-800 dark:text-dark-50'
                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-950 focus:bg-gray-100 focus:text-gray-950 dark:text-dark-200 dark:hover:bg-dark-300/10 dark:hover:text-dark-50 dark:focus:bg-dark-300/10'
            )}>
            <div className="flex min-w-0 items-center gap-3">
              {Icon && (
                <Icon
                  className={clsx(
                    'size-5 shrink-0 stroke-[1.5]',
                    !open && 'opacity-80 group-hover:opacity-100'
                  )}
                />
              )}
              <span className="truncate"> {title}</span>
            </div>
            <ChevronIcon
              className={clsx(
                'size-4 shrink-0 transition-transform',
                open && 'ltr:rotate-90 rtl:-rotate-90'
              )}
            />
          </AccordionButton>
          <AccordionPanel className="flex flex-col space-y-1 px-3 py-1.5">
            {childs.map((child) => {
              if (hasPermission(child.permission)) {
                return <MenuItem key={child.id} data={child} />;
              }
              return null;
            })}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

CollapsibleItem.propTypes = {
  data: PropTypes.object
};
