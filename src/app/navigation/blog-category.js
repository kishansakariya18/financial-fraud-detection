// Import Dependencies
import { TagIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const blogCategory = {
  id: 'blog-category',
  type: NAV_TYPE_ITEM,
  path: '/content-management/blog-category',
  title: 'Blog Categories',
  transKey: 'blog_categories',
  Icon: TagIcon,
  permission: PERMISSIONS.BLOG_CATEGORY.LIST
};
