import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const blogRoute = [
  {
    path: 'content-management/blogs',
    lazy: async () => {
      const { default: BlogList } = await import('../../pages/blogs/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG.LIST}>
            <BlogList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/blogs/create',
    lazy: async () => {
      const { default: CreateBlog } = await import('../../pages/blogs/CreateBlog');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG.CREATE}>
            <CreateBlog />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/blogs/:slug/edit',
    lazy: async () => {
      const { default: EditBlog } = await import('../../pages/blogs/EditBlog');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG.EDIT}>
            <EditBlog />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/blogs/:slug/details',
    lazy: async () => {
      const { default: ViewBlogDetails } = await import('../../pages/blogs/ViewBlogDetails');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG.LIST}>
            <ViewBlogDetails />
          </PrivateRoute>
        )
      };
    }
  }
];

export default blogRoute;
