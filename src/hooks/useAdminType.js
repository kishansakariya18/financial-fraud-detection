import { useSelector } from 'react-redux';
import { ADMIN_TYPE } from 'constants/app.constant';

/**
 * Hook to check admin type and layout permissions
 * @returns {Object} Admin type utilities
 */
export const useAdminType = () => {
  const userData = useSelector((state) => state.auth.userData);

  const adminType = userData?.AdminType;
  const isAdmin = userData?.AdminType === ADMIN_TYPE.ADMIN;
  const isAgent = userData?.AdminType === ADMIN_TYPE.AGENT;
  return {
    adminType,
    isAdmin,
    isAgent
  };
};
