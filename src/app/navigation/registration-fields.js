// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const registrationFields = {
  id: 'registration-fields',
  type: NAV_TYPE_ITEM,
  path: '/registration-fields',
  title: 'Registration Fields',
  transKey: 'registration_fields',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.REGISTRATION_FIELDS.VIEW
};
