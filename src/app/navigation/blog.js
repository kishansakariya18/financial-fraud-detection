// Import Dependencies
import { DocumentTextIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const blog = {
  id: 'blog',
  type: NAV_TYPE_ITEM,
  path: '/content-management/blogs',
  title: 'Blogs',
  transKey: 'blogs',
  Icon: DocumentTextIcon,
  permission: PERMISSIONS.BLOG.LIST
};
