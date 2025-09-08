// Import Dependencies
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Button } from 'components/ui';

import { TbEdit, TbStatusChange } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import CurrencyServices from 'services/currency.services';
import { CustomModal } from 'components/custom';
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';
import { AdminExchangeRateModal } from './AdminExchangeRateModal';
import { toast } from 'sonner';

export function RowActions({ row, table }) {
  const { t } = useTranslation();

  const confirmMessages = {
    pending: {
      title: t('change') + ' ' + t('status'),
      description: t('currency_status_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('currency') + ' ' + t('status') + ' ' + t('changed'),
      description: t('currency_status_suceess')
    }
  };

  const exchangeUpdateTypeConfirmMessages = {
    pending: {
      title: t('change') + ' ' + t('exchange_update_type'),
      description: t('exchange_update_type_desc'),
      actionText: t('submit')
    },
    success: {
      title: t('exchange_update_type') + ' ' + t('changed'),
      description: t('exchange_update_type_success')
    }
  };

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [exchangeUpdateTypeModalOpen, setExchangeUpdateTypeModalOpen] = useState(false);
  const [confirmStatusLoading, setConfirmStatusLoading] = useState(false);
  const [confirmExchangeUpdateTypeLoading, setConfirmExchangeUpdateTypeLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [exchangeUpdateTypeSuccess, setExchangeUpdateTypeSuccess] = useState(false);
  const [exchangeUpdateTypeError, setExchangeUpdateTypeError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdminRateModalOpen, setAdminRateModalOpen] = useState(false);

  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const onOkDialogBox = async () => {
    await table.options.meta?.editRow(row);
    setIsDialogOpen(false);
  };
  const closeModal = () => {
    setStatusModalOpen(false);
  };

  const closeExchangeUpdateTypeModal = () => {
    setExchangeUpdateTypeModalOpen(false);
  };

  const openExchangeUpdateTypeModal = () => {
    setExchangeUpdateTypeModalOpen(true);
    setExchangeUpdateTypeError(false);
    setExchangeUpdateTypeSuccess(false);
  };

  const openModal = () => {
    setStatusModalOpen(true);
    setStatusError(false);
    setStatusSuccess(false);
  };
  const handleChangeStatusRows = useCallback(async () => {
    setConfirmStatusLoading(true);
    const result = await CurrencyServices.changeCurrencyStatus(
      row.original.id,
      row.original.status
    );
    if (result.status === 200) {
      console.log('table.options: ', table.options);
      table.options.meta?.fetchNewList();
      setStatusSuccess(true);
      toast.success(result.response.message);
    } else {
      toast.error(result.response.message);
    }

    setConfirmStatusLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const handleExchangeUpdateTypeRows = useCallback(async () => {
    setConfirmExchangeUpdateTypeLoading(true);
    console.log('row.original.exchangeUpdateType: ', row.original.exchangeUpdateType);
    const result = await CurrencyServices.changeExchangeUpdateType(
      row.original.id,
      row.original.exchangeUpdateType
    );
    if (result.status === 200) {
      table.options.meta?.fetchNewList();
      setExchangeUpdateTypeSuccess(true);
      toast.success(result.response.message);
    } else {
      toast.error(result.response.message);
    }

    setConfirmExchangeUpdateTypeLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  // const handleDeleteRows = async () => {
  //   const result = await CurrencyServices.deleteCurrency(row.original.id);
  //   if (result.status === 200) {
  //     table.options.meta?.fetchNewList();
  //     toast.success(result.response.message);
  //   } else {
  //     toast.error(result.response.message || 'Failed to delete currency');
  //   }
  // };

  const statusState = statusError ? 'error' : statusSuccess ? 'success' : 'pending';
  const exchangeUpdateTypeState = exchangeUpdateTypeError
    ? 'error'
    : exchangeUpdateTypeSuccess
      ? 'success'
      : 'pending';

  // Hide row actions for INR currency
  const isDefault = row?.original?.is_default == 1;
  if (isDefault) {
    return null;
  }

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
              className="absolute z-[100] w-[15rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
              {hasPermission(PERMISSIONS.CURRENCIES.CHANGE_STATUS) && (
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
              )}
              {hasPermission(PERMISSIONS.CURRENCIES.EDIT) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() =>
                        navigate(`/casino-management/currencies/edit/${row.original.id}`)
                      }
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <TbEdit className="size-4.5 stroke-1" />
                      <span>{t('edit')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.CURRENCIES.EXCHANGE_HISTORY) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => {
                        navigate(
                          `/casino-management/currencies/exchange-history/${row.original.code}/list`
                        );
                      }}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <ChartBarIcon className="size-4.5 stroke-1" />
                      <span>{t('exchange_history')}</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {hasPermission(PERMISSIONS.CURRENCIES.ADMIN_EXCHANGE_RATE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setAdminRateModalOpen(true)}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <CurrencyDollarIcon className="size-4.5 stroke-1" />
                      <span>{t('admin_exchange_rate')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {hasPermission(PERMISSIONS.CURRENCIES.EXCHANGE_UPDATE_TYPE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={openExchangeUpdateTypeModal}
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-none transition-colors dark:text-this-light rtl:space-x-reverse',
                        focus && 'bg-this/10 dark:bg-this-light/10'
                      )}>
                      <Cog6ToothIcon className="size-4.5 stroke-1" />
                      <span>{t('exchange_update_type')}</span>
                    </button>
                  )}
                </MenuItem>
              )}
              {/* {hasPermission(PERMISSIONS.CURRENCIES.DELETE) && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
                        focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
                      )}
                      onClick={() => handleDeleteRows()}>
                      <TrashIcon className="size-4.5 stroke-1" />
                      <span>{t('remove')}</span>
                    </button>
                  )}
                </MenuItem>
              )} */}
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <CustomModal
        show={isDialogOpen}
        title={t('casino_provider') + ' ' + t('details')}
        btnTitle={t('casino_provider') + ' ' + t('details')}
        icon={<PencilIcon className="size-4.5 stroke-1" />}
        btnClassName={clsx(
          'flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-none transition-colors rtl:space-x-reverse',
          focus && 'bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100'
        )}
        onClose={onCloseDialogBox}
        onOpen={onOpenDialogBox}
        onOk={onOkDialogBox}>
        {/* <EditProvider
          providerName={row.original.name}
          providerId={row.original.id}
          value={row.original.image}
          closeModal={onOkDialogBox}
        /> */}
      </CustomModal>
      <ConfirmModal
        show={statusModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleChangeStatusRows}
        confirmLoading={confirmStatusLoading}
        state={statusState}
      />
      <ConfirmModal
        show={exchangeUpdateTypeModalOpen}
        onClose={closeExchangeUpdateTypeModal}
        messages={exchangeUpdateTypeConfirmMessages}
        onOk={handleExchangeUpdateTypeRows}
        confirmLoading={confirmExchangeUpdateTypeLoading}
        state={exchangeUpdateTypeState}
      />
      <AdminExchangeRateModal
        show={isAdminRateModalOpen}
        onClose={() => setAdminRateModalOpen(false)}
        row={row}
        table={table}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object
};
