// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  XCircleIcon,
  //   EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
// import { TbStatusChange } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import FaqService from 'services/faq.services';
import { AnimatedTick } from 'components/shared/AnimatedTick';

export function RowActions({ row, table }) {
  const { t } = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState(false);
  const navigate = useNavigate();

  const statusMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: t('are_you_sure'),
      actionText: t('yes'),
      Icon: ExclamationTriangleIcon,
      iconClassName: 'text-warning'
    },
    success: {
      title: t('success'),
      description: t('status_updated_successfully'),
      Icon: AnimatedTick,
      iconClassName: 'text-success',
      actionText: t('done')
    },
    error: {
      Icon: XCircleIcon,
      title: t('error'),
      description: errorMessage || t('failed_to_change_status'),
      iconClassName: 'text-error',
      actionText: t('retry')
    }
  };

  const deleteMessages = {
    pending: {
      title: t('delete_key') + ' ' + t('faq'),
      description: t('are_you_sure'),
      actionText: t('submit'),
      Icon: ExclamationTriangleIcon,
      iconClassName: 'text-warning'
    },
    success: {
      title: t('success'),
      description: t('faq') + ' ' + t('delete_success'),
      Icon: AnimatedTick,
      iconClassName: 'text-success',
      actionText: t('done')
    },
    error: {
      Icon: XCircleIcon,
      title: t('error'),
      description: errorMessage || t('delete_failed'),
      iconClassName: 'text-error',
      actionText: t('retry')
    }
  };

  const closeModal = (type = 'delete') => {
    if (type === 'delete') {
      setDeleteModalOpen(false);
    } else {
      setStatusModalOpen(false);
      setStatusChangeError(false);
      setStatusChangeSuccess(false);
    }
    table.options.meta?.fetchNewList();
  };

  //   const handleClickView = () => {
  //     navigate(`/release-notes/view/${row.original.releaseNoteUID}`);
  //   };

  const openModal = (type = 'delete') => {
    if (type === 'delete') {
      setDeleteModalOpen(true);
      setDeleteError(false);
      setDeleteSuccess(false);
    } else {
      setStatusModalOpen(true);
      setStatusChangeError(false);
      setStatusChangeSuccess(false);
    }
  };

  const handleDeleteRows = useCallback(async () => {
    setConfirmDeleteLoading(true);
    const result = await FaqService.delete({ faqUID: row.original.id });
    if (result.status === 200 || result.status === 201) {
      setDeleteSuccess(true);
      toast.success(result.response.message, {
        invert: true
      });
      setTimeout(() => {
        navigate('/faq');
      }, 0);
      table.options.meta?.deleteRow(row);
    } else {
      setErrorMessage(result.error);
      setDeleteError(true);
    }

    setConfirmDeleteLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';
  const statusState = statusChangeError ? 'error' : statusChangeSuccess ? 'success' : 'pending';

  const handleStatusChange = async () => {
    // If status change endpoint is introduced, integrate here.
    // For now, simply close modal.
    setStatusChangeLoading(true);
    setTimeout(() => {
      setStatusChangeLoading(false);
      setStatusChangeSuccess(true);
    }, 300);
  };

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
              className="absolute z-[100] w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={() =>
                      navigate(`/faq/edit/${row.original.id}`, {
                        state: { detail: row.original }
                      })
                    }>
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>{t('edit')}</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={() => openModal('delete')}>
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>{`${t('delete_text')}`}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={() => closeModal('delete')}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        messages={deleteMessages}
        state={deleteState}
      />
      <ConfirmModal
        show={statusModalOpen}
        onClose={() => closeModal('status')}
        onOk={handleStatusChange}
        confirmLoading={statusChangeLoading}
        messages={statusMessages}
        state={statusState}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
