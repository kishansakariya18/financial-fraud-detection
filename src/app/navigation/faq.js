// Import Dependencies
import { TbMessage2Question } from 'react-icons/tb';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const faq = {
  id: 'faq',
  type: NAV_TYPE_ITEM,
  path: '/faq',
  title: 'FAQ',
  transKey: 'faq',
  Icon: TbMessage2Question,
  permission: [PERMISSIONS.FAQ.VIEW],
  platformType: [PLATFORM_TYPE.B2C]
};
