import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { TbUpload } from 'react-icons/tb';
import apiConfig from 'configs/api.config';
import { Link } from 'react-router';
import clsx from 'clsx';
import { Button } from 'components/ui';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { getStageAppToApi, mapType } from 'app/pages/reports/helper';
export const ExportCSV = ({ filters = {} }) => {
  console.log('filters:', filters);

  return (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Menu as="div" className="relative inline-block whitespace-nowrap text-left">
        <MenuButton
          as={Button}
          variant="outlined"
          className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse">
          <TbUpload className="size-4" />
          <span>Export</span>
          <ChevronUpDownIcon className="size-4" />
        </MenuButton>
        <Transition
          as={MenuItems}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <Link
                className={clsx(
                  'flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors',
                  focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                )}
                to={`${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.BETSLIP_EXPORT}?startDate=${filters.startDate ? String(dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')) : ''}&endDate=${filters.endDate ? String(dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')) : ''}&keyword=${filters.keyword || ''}&stage=${filters.stage ? getStageAppToApi(filters.stage) : ''}&type=${filters.type ? mapType(filters.type) : ''}`}
                download
                title={`${t('export', { ns: 'glossary' }) + ' ' + t('report', { ns: 'glossary' })}`}>
                <span>Export as CSV</span>
              </Link>
            )}
          </MenuItem>
        </Transition>
      </Menu>
    </div>
  );
};
