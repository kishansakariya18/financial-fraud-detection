import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const bannerRoute = [
  {
    path: 'content-management/banner',
    lazy: async () => {
      const { default: BannerList } = await import('../../pages/banner/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANNER.LIST}>
            <BannerList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/banner/create',
    lazy: async () => {
      const { default: CreateBanner } = await import('../../pages/banner/CreateBanner');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANNER.ADD}>
            <CreateBanner />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/banner/:bannerId/edit',
    lazy: async () => {
      const { default: EditBanner } = await import('../../pages/banner/EditBanner');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANNER.EDIT}>
            <EditBanner />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/banner/reorder',
    lazy: async () => {
      const { default: ReOrderCategory } = await import('../../pages/banner/ReorderBanner');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANNER.EDIT}>
            <ReOrderCategory />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'content-management/banner/:bannerId/details',
    lazy: async () => {
      const { default: ViewBannerDetails } = await import('../../pages/banner/ViewBanner');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BANNER.LIST}>
            <ViewBannerDetails />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bannerRoute;
