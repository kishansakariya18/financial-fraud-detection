// Local Imports
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const peomocode = {
  id: 'peomocode',
  type: NAV_TYPE_ITEM,
  path: '/promocode',
  title: 'Promo Code',
  transKey: 'promocode',
  Icon: ArchiveBoxArrowDownIcon,
  permission: PERMISSIONS.DEPOSIT_PROMOCODE.LIST
};
