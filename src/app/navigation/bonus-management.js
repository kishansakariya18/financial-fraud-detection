// Import Dependencies
import { CircleStackIcon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_ITEM,
  PERMISSIONS,
  PLATFORM_TYPE
} from 'constants/app.constant';

export const bonusManagement = {
  id: 'bonus_management',
  type: NAV_TYPE_COLLAPSE,
  path: '/bonus',
  title: 'Bonus Management',
  transKey: 'bonus_management',
  Icon: CircleStackIcon,
  permission: [PERMISSIONS.REFERRAL_MANAGEMENT.EDIT, PERMISSIONS.BONUS_TEMPLATES.LIST],
  platformType: PLATFORM_TYPE.B2C,
  childs: [
    {
      id: 'bonus_templates',
      type: NAV_TYPE_ITEM,
      path: '/bonus/templates',
      title: 'Bonus Templates',
      transKey: 'bonus_templates',
      Icon: DocumentDuplicateIcon,
      permission: PERMISSIONS.BONUS_TEMPLATES.LIST,
      platformType: PLATFORM_TYPE.B2C
    },
    {
      id: 'referral_management',
      type: NAV_TYPE_ITEM,
      path: '/bonus/referral-management',
      title: 'Referral Management',
      transKey: 'referral_management',
      Icon: ShareIcon,
      permission: PERMISSIONS.REFERRAL_MANAGEMENT.EDIT,
      platformType: PLATFORM_TYPE.B2C
    }
  ]
};
