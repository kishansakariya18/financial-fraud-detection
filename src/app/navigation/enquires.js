// Local Imports
import { IoMdContacts } from 'react-icons/io';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const enquires = {
  id: 'enquires',
  type: NAV_TYPE_ITEM,
  path: '/enquires',
  title: 'Enquires',
  transKey: 'enquires',
  Icon: IoMdContacts,
  permission: PERMISSIONS.ENQUIRES.LIST
};
