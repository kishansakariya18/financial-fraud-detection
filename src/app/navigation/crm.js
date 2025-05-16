// Import Dependencies
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const crm = {
  id: 'crm',
  type: NAV_TYPE_ITEM,
  path: '/crm',
  title: 'Customer Relationship',
  transKey: 'crm',
  Icon: ChatBubbleLeftRightIcon,
  permission: PERMISSIONS.CRM.VIEW
};
