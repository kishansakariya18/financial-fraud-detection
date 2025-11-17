// Import Dependencies
import { FolderIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
import { banner } from './banner';
import { pages } from './pages';
import { blog } from './blog';
import { blogCategory } from './blog-category';

export const contentManagement = {
  id: 'content.management',
  type: NAV_TYPE_COLLAPSE,
  path: '/content-management',
  title: 'Content Management',
  transKey: 'content_management',
  Icon: FolderIcon,
  permission: [
    PERMISSIONS.PAGE.VIEW,
    PERMISSIONS.BANNER.LIST,
    PERMISSIONS.BLOG.LIST,
    PERMISSIONS.BLOG_CATEGORY.LIST
  ],
  childs: [pages, banner, blogCategory, blog]
};
