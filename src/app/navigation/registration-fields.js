// Import Dependencies
import { PiCashRegister } from 'react-icons/pi';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const registrationFields = {
  id: 'registration-fields',
  type: NAV_TYPE_ITEM,
  path: '/registration-fields',
  title: 'Registration Fields',
  transKey: 'registration_fields',
  Icon: PiCashRegister,
  permission: PERMISSIONS.REGISTRATION_FIELDS.VIEW
};
