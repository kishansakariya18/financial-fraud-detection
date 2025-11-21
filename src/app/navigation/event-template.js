// Local Imports
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { FaClipboardCheck } from 'react-icons/fa6';
import { TbTemplate } from 'react-icons/tb';

export const emailTemplate = [
  {
    id: 'event-template',
    type: NAV_TYPE_COLLAPSE,
    path: '/event-template',
    title: 'Event Template',
    transKey: 'template_manager',
    Icon: TbTemplate,
    permission: [PERMISSIONS.EVENT_TEMPLATE.VIEW, PERMISSIONS.ASSIGN_EVENT_TEMPLATES.UPDATE],
    childs: [
      {
        id: 'event-template',
        type: NAV_TYPE_ITEM,
        path: '/event-template/list',
        title: 'Event Template',
        transKey: 'eventTemplate',
        Icon: ArchiveBoxArrowDownIcon,
        permission: PERMISSIONS.EVENT_TEMPLATE.VIEW
      },
      {
        id: 'event-template-assign',
        type: NAV_TYPE_ITEM,
        path: '/event-template/event-template-assign',
        title: 'Assign to Group',
        transKey: 'assignTemplate',
        Icon: FaClipboardCheck,
        permission: PERMISSIONS.ASSIGN_EVENT_TEMPLATES.UPDATE
      }
    ]
  }
];
