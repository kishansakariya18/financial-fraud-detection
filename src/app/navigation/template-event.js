// Local Imports
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const emailTemplate = {
  id: 'event-template',
  type: NAV_TYPE_ITEM,
  path: '/event-template',
  title: 'Event Template',
  transKey: 'eventTemplate',
  Icon: ArchiveBoxArrowDownIcon,
  permission: PERMISSIONS.EVENT_TEMPLATE.VIEW
};
