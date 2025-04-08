// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { TbPackage } from 'react-icons/tb';

export const payment = {
  id: 'payment',
  type: NAV_TYPE_ITEM,
  path: '/payment',
  title: 'Payment',
  transKey: 'payment',
  Icon: TbPackage,
  permission: PERMISSIONS.PAYMENT.VIEW
};
