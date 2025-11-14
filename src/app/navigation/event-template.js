// Local Imports
import { ArchiveBoxArrowDownIcon, CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const emailTemplate = [
  {
    id: 'event-template',
    type: NAV_TYPE_ITEM,
    path: '/event-template',
    title: 'Event Template',
    transKey: 'eventTemplate',
    Icon: ArchiveBoxArrowDownIcon,
    permission: PERMISSIONS.EVENT_TEMPLATE.VIEW
  },

  {
    key: 'event-template-assign',
    type: NAV_TYPE_ITEM,
    path: '/event-template-assign',
    title: 'Assign to Group',
    transKey: 'assignTemplate',
    Icon: CalendarDateRangeIcon,
    permission: PERMISSIONS.ASSIGN_EVENT_TEMPLATES.UPDATE
  }
];
