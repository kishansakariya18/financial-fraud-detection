// Local Imports
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const enquires = {
  id: 'enquires',
  type: NAV_TYPE_ITEM,
  path: '/enquires',
  title: 'Enquires',
  transKey: 'enquires',
  Icon: ChatBubbleLeftRightIcon,
  permission: PERMISSIONS.RESPONSIBLE_GAMING_RESTRICTIONS.VIEW
};
