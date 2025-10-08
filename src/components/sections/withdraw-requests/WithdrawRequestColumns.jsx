import { useMemo } from 'react';
import { CheckIcon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from 'components/ui';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';
import { t } from 'i18next';
import { entityTypeOptions, statusOptions } from './helper';
import { BadgeCell, DateCell } from 'components/custom/table/cell';

export function WithdrawRequestColumns({ onUpdateStatus, showActions = true, listFor }) {
  return useMemo(() => {
    const columns = [
      {
        id: 'requestId',
        accessorKey: 'requestId',
        header: t('request_id')
      },
      ...(listFor === 'agent'
        ? [
            {
              id: 'agentName',
              accessorKey: 'agentName',
              header: t('agent_name')
            }
          ]
        : []),
      ...(listFor === 'player'
        ? [
            {
              id: 'playerName',
              accessorKey: 'playerName',
              header: t('player')
            }
          ]
        : []),
      {
        id: 'amount',
        accessorKey: 'amount',
        header: t('amount')
      },
      // {
      //   id: 'toEntityType',
      //   accessorKey: 'toEntityType',
      //   header: t('entity_type'),
      //   cell: BadgeCell,
      //   meta: { optionData: entityTypeOptions }
      // },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('status'),
        cell: BadgeCell,
        meta: { optionData: statusOptions }
      },
      {
        id: 'remarks',
        accessorKey: 'remarks',
        header: t('remarks')
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: t('created_at'),
        cell: DateCell
      }
    ];

    // Add actions column only if showActions is true
    if (showActions && onUpdateStatus) {
      columns.push({
        id: 'actions',
        header: t('actions'),
        cell: ({ row }) => {
          const status = row.getValue('status');

          // Only show action menu for pending requests
          if (status !== 'pending') {
            return (
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-500">-</span>
              </div>
            );
          }

          return (
            <div className="flex justify-center">
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
                          className={clsx(
                            'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-green-600 outline-none transition-colors hover:bg-green-50 hover:text-green-700 rtl:space-x-reverse',
                            focus && 'bg-green-50 text-green-700'
                          )}
                          onClick={() => onUpdateStatus(row.original, 'settled')}>
                          <CheckIcon className="size-4.5 stroke-1" />
                          <span>{t('approve_request')}</span>
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          className={clsx(
                            'flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-600 outline-none transition-colors hover:bg-red-50 hover:text-red-700 rtl:space-x-reverse',
                            focus && 'bg-red-50 text-red-700'
                          )}
                          onClick={() => onUpdateStatus(row.original, 'rejected')}>
                          <XMarkIcon className="size-4.5 stroke-1" />
                          <span>{t('reject_request')}</span>
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          );
        }
      });
    }

    return columns;
  }, [onUpdateStatus, showActions, listFor]);
}
