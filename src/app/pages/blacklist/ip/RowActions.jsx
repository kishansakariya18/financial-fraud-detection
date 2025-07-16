import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui';
import { BlockUnblockModal } from 'components/shared/BlockUnblockModal';
import { TbTrash } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

export function RowActions({ table }) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshTable = () => {
    if (table.options?.meta?.fetchNewList) {
      table.options.meta.fetchNewList();
    }
    if (table.options?.meta?.fetchSummary) {
      table.options.meta.fetchSummary();
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setError(false);
    setErrorMessage('');
    refreshTable();
  };

  const openModal = () => {
    setModalOpen(true);
    setError(false);
    setErrorMessage('');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual delete API call
      // await BlacklistService.deleteIP(row.original.id);
      setLoading(false);
      closeModal();
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(false);
    setErrorMessage('');
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
              className="absolute z-[100] w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <TbTrash className="size-4.5 stroke-1" />
                    <span>{t('delete')}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <BlockUnblockModal
        show={modalOpen}
        onClose={closeModal}
        onSubmit={handleDelete}
        blocked={false}
        confirmLoading={loading}
        error={error}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        itemType={t('IP Address')}
        actionLabel={t('delete')}
        showReasonInput={false}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};

export default RowActions;
