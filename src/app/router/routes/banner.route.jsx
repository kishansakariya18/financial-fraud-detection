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
          <PrivateRoute permission={PERMISSIONS.BANNER.ADD}>
            <EditBanner />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bannerRoute;
