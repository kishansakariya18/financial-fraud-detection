// Import Dependencies
import { NewspaperIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const segmentation = {
  id: 'segmentation',
  type: NAV_TYPE_ITEM,
  path: '/segmentation',
  title: 'Affiliates',
  transKey: 'segmentation',
  Icon: NewspaperIcon,
  permission: PERMISSIONS.SEGMENTATION.LIST
};
