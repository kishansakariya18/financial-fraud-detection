// Local Imports
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const campaign = {
  id: 'campaign',
  type: NAV_TYPE_ITEM,
  path: '/campaign',
  title: 'Campaign',
  transKey: 'campaign',
  Icon: MegaphoneIcon,
  permission: PERMISSIONS.CAMPAIGN?.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
