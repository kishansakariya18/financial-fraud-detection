// Import Dependencies

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { TbNotes } from 'react-icons/tb';

export const releaseNotes = {
  id: 'release-notes',
  type: NAV_TYPE_ITEM,
  path: '/release-notes',
  title: 'Release Notes',
  transKey: 'release_notes',
  Icon: TbNotes,
  permission: PERMISSIONS.RELEASE_NOTE.VIEW
};
