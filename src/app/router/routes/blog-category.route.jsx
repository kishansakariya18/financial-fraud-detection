import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const blogCategoryRoute = [
  {
    path: 'content-management/blog-category',
    lazy: async () => {
      const { default: BlogCategoryList } = await import('../../pages/blog-category/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG_CATEGORY.LIST}>
            <BlogCategoryList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/blog-category/:categoryId/details',
    lazy: async () => {
      const { default: ViewBlogCategoryDetails } =
        await import('../../pages/blog-category/ViewBlogCategoryDetails');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLOG_CATEGORY.LIST}>
            <ViewBlogCategoryDetails />
          </PrivateRoute>
        )
      };
    }
  }
];

export default blogCategoryRoute;
