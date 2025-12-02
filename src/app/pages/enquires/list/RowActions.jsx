// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { CustomModal } from 'components/custom';
import ViewModal from '../ViewModal';
import { TbStatusChange } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import EnquiresService from 'services/enquires.service';
import { toast } from 'sonner';
import { enquiresStatusOptions } from '../helper';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  // Delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Change status states
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('IN_PROGRESS');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const navigate = useNavigate();

  const confirmMessages = {
    pending: {
      title: t('delete_key') + ' ' + t('enquires'),
      description: t('areYouSure'),
      actionText: t('submit')
    },
    success: {
      title: t('enquires') + ' ' + t('delete_success'),
      description: t('delete_success')
    },
    error: {
      Icon: XCircleIcon,
      title: t('failed'),
      description: errorMessage,
      iconClassName: 'text-error'
    }
  };

  const statusConfirmMessages = {
    pending: {
      description: t('areYouSureEnquiresChangeStatus'),
      actionText: t('submit')
    },
    success: {
      title: t('success'),
      description: t('enquires_status_success')
    }
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
  };

  const onOpenDialogBox = async () => {
    setIsDialogOpen(true);
    setDetailLoading(true);
    const result = await EnquiresService.details(row.original.id);
    if (result?.status === 200) {
      setDetailData(result.response?.data);
    } else {
      toast.error(result?.error || t('something_went_wrong'));
    }
    setDetailLoading(false);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
    setDetailData(null);
  };

  const openStatusModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await EnquiresService.delete(row.original.id);
    if (result?.status === 200) {
      // Prefer table meta deleteRow if available, otherwise reload list
      if (table.options?.meta?.deleteRow) {
        table.options.meta.deleteRow(row);
      } else if (table.options?.meta?.fetchNewList) {
        table.options.meta.fetchNewList();
      }
      setDeleteSuccess(true);
      toast.success(result.response?.message || t('delete_success'), {
        invert: true
      });
      setTimeout(() => {
        navigate('/enquires');
      }, 800);
    } else {
      setErrorMessage(result?.error || result?.response?.message || t('something_went_wrong'));
      setDeleteError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';
  const statusState = statusError ? 'error' : statusSuccess ? 'success' : 'pending';

  return (
    <>
      <div className="flex justify-center space-x-1.5 rtl:space-x-reverse">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2">
            <MenuItems
              anchor={{ to: 'bottom end', gap: 12 }}
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onOpenDialogBox}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view_details') || t('view')}</span>
                  </button>
                )}
              </MenuItem>
              {hasPermission(PERMISSIONS.ENQUIRES.CHANGE_STATUS) &&
                (row?.original?.status === 'NEW' || row?.original?.status === 'IN_PROGRESS') && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openStatusModal}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                          focus && 'bg-this/10 dark:bg-this-light/10'
                        )}>
                        <TbStatusChange className="size-4.5 stroke-1" />
                        <span>{t('enquiry_change_status')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <CustomModal
        show={isDialogOpen}
        title={t('enquires') + ' ' + t('details')}
        btnTitle={t('view_details') || t('view')}
        onClose={onCloseDialogBox}
        onOpen={onOpenDialogBox}
        hideOKButton>
        {detailLoading ? (
          <div className="p-6 text-center text-sm text-gray-500">{t('loading')}...</div>
        ) : (
          <ViewModal data={detailData || row.original} />
        )}
      </CustomModal>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
      <ConfirmModal
        show={statusModalOpen}
        onClose={closeStatusModal}
        messages={statusConfirmMessages}
        onOk={async () => {
          setConfirmStatusLoading(true);
          const result = await EnquiresService.changeStatus(selectedStatus, row.original.id);
          if (result?.status === 200) {
            if (table.options?.meta?.fetchNewList) {
              table.options.meta.fetchNewList();
            }
            // Refresh summary after status change
            if (table.options?.meta?.fetchSummary) {
              table.options.meta.fetchSummary();
            }
            setStatusSuccess(true);
            toast.success(result.response?.message || 'Status changed successfully');
          } else {
            setStatusError(true);
            toast.error(result?.error || result?.response?.message || t('something_went_wrong'));
          }
          setConfirmStatusLoading(false);
        }}
        confirmLoading={confirmStatusLoading}
        state={statusState}>
        {statusState === 'pending' && (
          <div className="mt-6 space-y-3">
            {enquiresStatusOptions
              .filter((option) => option.value !== 'NEW')
              .map((option) => (
                <div key={option.value} className="text-left">
                  <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-dark-500 dark:hover:bg-dark-600 rtl:space-x-reverse">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="size-4 cursor-pointer text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 dark:text-dark-100">
                        {option.label}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
          </div>
        )}
      </ConfirmModal>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
