// // Local Imports
// import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

// export const affiliatesNew = {
//   id: 'affiliates.new',
//   type: NAV_TYPE_ITEM,
//   path: '/affiliates',
//   title: 'Affiliates',
//   transKey: 'affiliates',
//   Icon: UsersIcon,
//   permission: PERMISSIONS.AFFILIATES.LIST,
//   platformType: [PLATFORM_TYPE.B2C]
// };

import { UsersIcon } from '@heroicons/react/20/solid';

import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { GrSettingsOption } from 'react-icons/gr';
import { TbAffiliate } from 'react-icons/tb';
// import { affliate } from './affiliates';

export const affiliatesNew = {
  id: 'affiliates.new',
  type: NAV_TYPE_COLLAPSE,
  path: '/affiliates',
  title: 'Affiliates',
  transKey: 'affiliate',
  Icon: TbAffiliate,
  permission: [PERMISSIONS.AFFILIATES.LIST, PERMISSIONS.COMMISSION_SETTING],
  childs: [
    {
      id: 'affiliates.list',
      path: '/affiliates/users',
      type: NAV_TYPE_ITEM,
      title: 'Affiliates',
      transKey: 'affiliates',
      Icon: UsersIcon,
      permission: PERMISSIONS.AFFILIATES.LIST
    },
    {
      id: 'affiliates.commission',
      path: '/affiliates/commission-setting',
      type: NAV_TYPE_ITEM,
      title: 'Commission',
      transKey: 'nav.commission-setting',
      Icon: GrSettingsOption,
      permission: PERMISSIONS.COMMISSION_SETTING
    }
  ]
};
