// Local Imports
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const bonusCampaign = {
  id: 'bonusCampaign',
  type: NAV_TYPE_ITEM,
  path: '/bonus-campaign',
  title: 'Bonus Campaign',
  transKey: 'bonusCampaign',
  Icon: ReceiptPercentIcon,
  permission: PERMISSIONS.LIST
};
