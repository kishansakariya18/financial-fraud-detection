import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { TbUpload } from 'react-icons/tb';
import { Link } from 'react-router'; // Assuming this is react-router v3 or similar for 'to' prop
import clsx from 'clsx';
import { Button } from 'components/ui';
import { t } from 'i18next';
import { toast } from 'sonner';
// import dayjs from 'dayjs';
import moment from 'moment-timezone';

// TODO: Import your preferred toast notification library
// For example:
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export const ExportCSV = ({ filters = {}, url }) => {
  const handleExportAttempt = (event) => {
    if (!filters || !filters.startDate || !filters.endDate) {
      event.preventDefault(); // Prevent the Link from navigating and triggering download

      // TODO: Replace alert with a proper toast message
      // For example, using react-toastify:
      toast.error('Please select a Start Date and End Date to export the report.');
      // alert('Please select a Start Date and End Date to export the report.');
    }
    const sDate = moment(Number(filters.startDate));
    const eDate = moment(Number(filters.endDate));

    const diffInDays = eDate.diff(sDate, 'days');

    console.log('Start Date:', sDate.format('YYYY-MM-DD'));
    console.log('End Date:', eDate.format('YYYY-MM-DD'));
    console.log('Duration in days:', diffInDays);

    if (diffInDays > 60) {
      toast.error('Maximum 60 days Range to export the report.');
    }
  };

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
          as={MenuItems} // Renamed from Fragment to MenuItems for clarity if it's the items container
          enter="transition ease-out duration-100" // Adjusted duration for typical transitions
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75" // Adjusted duration
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {(
              { focus } // Headless UI's MenuItem render prop usually provides 'active' for hover/focus state.
            ) => (
              // If 'focus' is what your setup provides and uses, keep it.
              // Otherwise, you might want to use 'active'.
              <Link
                className={clsx(
                  'flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors',
                  focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                )}
                to={url}
                download
                onClick={handleExportAttempt} // Added click handler for conditional export
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
