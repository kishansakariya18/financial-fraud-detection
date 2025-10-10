import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { TbUpload } from 'react-icons/tb';
import clsx from 'clsx';
import { Button } from 'components/ui';
import { t } from 'i18next';
import { toast } from 'sonner';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useState } from 'react';
import apiConfig from 'configs/api.config';
import apiInstance from 'utils/apiInstance';

// Constants
const MAX_EXPORT_DAYS = 365;

export const ExportCSV = ({
  filters = {},
  requestFilters = {},
  maxDays = MAX_EXPORT_DAYS,
  disabled = false,
  className = '',
  apiEndpoint = null, // New prop for API endpoint
  requestMethod = 'POST' // New prop for request method
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const validateExport = () => {
    // Check if required date filters are present
    if (!filters?.startDate || !filters?.endDate) {
      toast.error('Please select a Start Date and End Date to export the report.');
      return false;
    }

    // Validate date range
    const startDate = moment(Number(filters.startDate));
    const endDate = moment(Number(filters.endDate));

    if (!startDate.isValid() || !endDate.isValid()) {
      toast.error('Invalid date format. Please select valid dates.');
      return false;
    }

    if (startDate.isAfter(endDate)) {
      toast.error('Start date cannot be after end date.');
      return false;
    }

    const diffInDays = endDate.diff(startDate, 'days');
    if (diffInDays > maxDays) {
      toast.error(`Maximum ${maxDays} days range allowed for export.`);
      return false;
    }

    return true;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApiExport = async () => {
    if (!validateExport()) return;
    if (!apiEndpoint) {
      toast.error('Export API endpoint not configured.');
      return;
    }

    setIsExporting(true);

    // Create promise toast
    const exportPromise = new Promise((resolve, reject) => {
      const apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiEndpoint}`;
      const method = requestMethod?.toUpperCase() === 'POST' ? 'post' : 'get';

      // Axios config
      const config = {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' },
        ...(method === 'get' ? { params: requestFilters } : {})
      };

      // Perform request
      const response =
        method === 'get'
          ? apiInstance.get(apiURL, config)
          : apiInstance.post(apiURL, requestFilters, config);

      response
        .then(async (res) => {
          const blob = res.response;

          // Check if response.data is actually a Blob
          if (!(blob instanceof Blob)) {
            throw new Error('Invalid response format - expected Blob');
          }

          // Extract filename from headers
          const headers = response.headers || {};
          const contentDisposition =
            headers['content-disposition'] || headers['Content-Disposition'];
          const filename =
            contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'export.csv';

          // Download CSV
          const text = await blob.text();
          downloadCSV(text, filename);

          resolve('Export completed successfully!');
        })
        .catch((error) => {
          console.error('Export error:', error);
          reject(new Error(`Export failed: ${error.message}`));
        })
        .finally(() => {
          setIsExporting(false);
        });
    });
    // Show promise toast with progress
    toast.promise(exportPromise, {
      loading: 'processing export...',
      success: (message) => message,
      error: (error) => error.message
    });
  };

  const handleExportAttempt = (event) => {
    if (apiEndpoint) {
      event.preventDefault();
      handleApiExport();
    } else if (!validateExport()) {
      event.preventDefault();
      return;
    }
  };

  return (
    <div className={clsx('flex space-x-2 rtl:space-x-reverse', className)}>
      <Menu as="div" className="relative inline-block whitespace-nowrap text-left">
        <MenuButton
          as={Button}
          variant="outlined"
          disabled={disabled || isExporting}
          className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
          aria-label="Export options">
          <TbUpload className="size-4" />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          <ChevronUpDownIcon className="size-4" />
        </MenuButton>
        <Transition
          as={MenuItems}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  'flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors',
                  focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100',
                  isExporting && 'cursor-not-allowed opacity-50'
                )}
                onClick={handleExportAttempt}
                disabled={isExporting}
                title={`${t('export', { ns: 'glossary' })} ${t('report', { ns: 'glossary' })}`}
                aria-label="Export report as CSV">
                <span>{isExporting ? 'Exporting...' : 'Export as CSV'}</span>
              </button>
            )}
          </MenuItem>
        </Transition>
      </Menu>
    </div>
  );
};

ExportCSV.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  maxDays: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  apiEndpoint: PropTypes.string, // New prop for API endpoint
  requestFilters: PropTypes.object, // New prop for request body
  requestMethod: PropTypes.oneOf(['GET', 'POST', 'PUT']) // New prop for request method
};
