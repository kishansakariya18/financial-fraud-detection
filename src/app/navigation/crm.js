// Import Dependencies
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const crm = {
  id: 'crm',
  type: NAV_TYPE_ITEM,
  path: '/crm/notifications',
  title: 'Customer Relationship',
  transKey: 'crm',
  Icon: ChatBubbleLeftRightIcon,
  permission: [PERMISSIONS.CRM.VIEW]
  // childs: [
  //   {
  //     id: 'crm.send',
  //     type: NAV_TYPE_ITEM,
  //     path: '/crm',
  //     title: 'Send Notification',
  //     transKey: 'crm_send',
  //     Icon: ChatBubbleLeftRightIcon,
  //     permission: PERMISSIONS.CRM.VIEW
  //   },
  //   {
  //     id: 'crm.notifications',
  //     type: NAV_TYPE_ITEM,
  //     path: '/crm/notifications',
  //     title: 'Notification List',
  //     transKey: 'crm_notifications',
  //     Icon: ChatBubbleLeftRightIcon,
  //     permission: PERMISSIONS.CRM.VIEW
  //   }
  // ]
};
