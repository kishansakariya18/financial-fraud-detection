// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { TbStatusChange } from 'react-icons/tb';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';
import { useTranslation } from 'react-i18next';

export function AgentRowActions({ row, table, onViewAgent, onEditAgent, onChangeAgentStatus }) {
  const { t } = useTranslation();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const confirmMessages = {
    pending: {
      description: t('agent_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('agent') + ' ' + t('status') + ' ' + t('changed'),
      description: t('agent_status_success')
    }
  };

  const closeModal = () => {
    setStatusModalOpen(false);
  };

  const openModal = () => {
    setStatusModalOpen(true);
  };

  const handleClickView = () => {
    onViewAgent(row.original.agentUID);
  };

  const handleClickEdit = () => {
    onEditAgent(row.original.agentUID);
  };

  const handleChangeStatus = useCallback(async () => {
    setConfirmStatusLoading(true);
    try {
      const result = await onChangeAgentStatus(row.original.agentUID);
      if (result.status === 200) {
        table.options.meta?.deleteRow(row);
        table.options.meta?.fetchSummary();
        setStatusSuccess(true);
      } else {
        setStatusError(true);
      }
    } catch {
      setStatusError(true);
    }

    setConfirmStatusLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, onChangeAgentStatus]);

  const state = statusError ? 'error' : statusSuccess ? 'success' : 'pending';

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
                    onClick={handleClickView}>
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>{t('view')}</span>
                  </button>
                )}
              </MenuItem>
              {onEditAgent && (
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
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                      focus && 'bg-this/10 dark:bg-this-light/10'
                    )}>
                    <TbStatusChange className="size-4.5 stroke-1" />
                    <span>{t('change') + ' ' + t('status')}</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={statusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatus}
        confirmLoading={confirmStatusLoading}
        state={state}
      />
    </>
  );
}

AgentRowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  onViewAgent: PropTypes.func.isRequired,
  onEditAgent: PropTypes.func.isRequired,
  onChangeAgentStatus: PropTypes.func.isRequired
};
