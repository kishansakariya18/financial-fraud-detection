import { Outlet, Navigate } from 'react-router';
import { apiConfig } from 'configs/api.config';
import { PLATFORM_TYPE } from 'constants/app.constant';

/**
 * PlatformRouteGuard - Route guard that checks platform type compatibility
 * Ensures B2B routes are only accessible in B2B platform and B2C routes only in B2C platform
 */
export function PlatformRouteComponentGuard({
  allowedPlatforms = [PLATFORM_TYPE.B2B, PLATFORM_TYPE.B2C]
}) {
  const currentPlatform = apiConfig.platformType?.toLowerCase();

  // If current platform is not in allowed platforms, redirect to home
  if (!allowedPlatforms.includes(currentPlatform)) {
    console.warn(
      `Platform ${currentPlatform} is not allowed for this route. Allowed platforms: ${allowedPlatforms.join(', ')}`
    );
    return <Navigate to="/" replace />;
  }

  // If platform is allowed, render the nested routes
  return <Outlet />;
}

/**
 * B2BOnlyRouteGuard - Route guard specifically for B2B-only routes
 */
export function B2BOnlyRouteGuard() {
  return <PlatformRouteComponentGuard allowedPlatforms={[PLATFORM_TYPE.B2B]} />;
}

/**
 * B2COnlyRouteGuard - Route guard specifically for B2C-only routes
 */
export function B2COnlyRouteGuard() {
  return <PlatformRouteComponentGuard allowedPlatforms={[PLATFORM_TYPE.B2C]} />;
}
