// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import BlogCategoryService from '../../../../services/blog-category.services';
import { TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

export function RowActions ({ row, table, onAddEditClick }) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const deleteConfirmMessages = {
    pending: {
      title: t('areYouSure'),
      description: t('are_you_sure_you_want_to_delete_this_blog_category'),
      actionText: t('delete')
    },
    success: {
      title: t('blog_category') + ' ' + t('deleted'),
      description: t('blog_category_deleted_successfully')
    }
  };

  const statusConfirmMessages = {
    pending: {
      description: t('are_you_sure_you_want_to_change_blog_category_status'),
      actionText: t('submit')
    },
    success: {
      title: t('blog_category') + ' ' + t('status') + ' ' + t('changed'),
      description: t('blog_category_status_changed_successfully')
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
  };

  //   const handleClickView = () => {
  //     navigate(`/content-management/blog-category/${row.original.categoryId}/details`);
  //   };

  const handleClickEdit = () => {
    onAddEditClick(row.original.categoryId);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const openStatusModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };

  const handleDeleteCategory = useCallback(async () => {
    setConfirmDeleteLoading(true);
    await BlogCategoryService.deleteBlogCategory(row.original.categoryId)
      .then(() => {
        table.options.meta?.deleteRow(row);
        setDeleteSuccess('success');
      })
      .catch(() => {
        setDeleteError('error');
      })
      .finally(() => {
        setConfirmDeleteLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, table, t]);

  const handleChangeStatus = useCallback(async () => {
    setConfirmStatusLoading(true);
    await BlogCategoryService.changeBlogCategoryStatus(row.original.categoryId)
      .then(() => {
        table.options.meta?.changeStatus(row);
        setStatusSuccess('success');
      })
      .catch(() => {
        setStatusError('error');
      })
      .finally(() => {
        setConfirmStatusLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const deleteState = deleteError ? 'error' : deleteSuccess ? 'success' : 'pending';
  const statusState = statusError ? 'error' : statusSuccess ? 'success' : 'pending';
  const canShowActions =
    hasPermission(PERMISSIONS.BLOG_CATEGORY.EDIT) ||
    hasPermission(PERMISSIONS.BLOG_CATEGORY.CHANGE_STATUS) ||
    hasPermission(PERMISSIONS.BLOG_CATEGORY.DELETE);

  return (
    <>
      {canShowActions && (
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
                {/* <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                      focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                    )}
                    onClick={handleClickView}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view')}</span>
                  </button>
                )}
              </MenuItem> */}
                {hasPermission(PERMISSIONS.BLOG_CATEGORY.EDIT) && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                        )}
                        onClick={handleClickEdit}>
                        <PencilIcon className="size-4.5 stroke-1" />
                        <span>{t('edit')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {hasPermission(PERMISSIONS.BLOG_CATEGORY.CHANGE_STATUS) && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openStatusModal}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                          focus && 'bg-this/10 dark:bg-this-light/10'
                        )}>
                        <TbStatusChange className="size-4.5 stroke-1" />
                        <span>{t('change') + ' ' + t('status')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
                {hasPermission(PERMISSIONS.BLOG_CATEGORY.DELETE) && (
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={openDeleteModal}
                        className={clsx(
                          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-none transition-colors rtl:space-x-reverse',
                          focus && 'bg-error/10'
                        )}>
                        <TrashIcon className="size-4.5 stroke-1" />
                        <span>{t('deleteItem')}</span>
                      </button>
                    )}
                  </MenuItem>
                )}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      )}

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeDeleteModal}
        messages={deleteConfirmMessages}
        onOk={handleDeleteCategory}
        confirmLoading={confirmDeleteLoading}
        state={deleteState}
      />

      <ConfirmModal
        show={statusModalOpen}
        onClose={closeStatusModal}
        messages={statusConfirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmStatusLoading}
        state={statusState}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  onAddEditClick: PropTypes.func
};
