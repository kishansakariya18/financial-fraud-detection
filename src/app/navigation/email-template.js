// Local Imports
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const emailTemplate = {
  id: 'email-template',
  type: NAV_TYPE_ITEM,
  path: '/email-template',
  title: 'Email Template',
  transKey: 'emailTemplate',
  Icon: ArchiveBoxArrowDownIcon,
  permission: PERMISSIONS.EMAIL_TEMPLATE.LIST
};
