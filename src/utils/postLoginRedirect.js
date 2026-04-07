/**
 * Where to send the user after a successful login.
 * - Admins default to /admin/dashboard; only honor location state if it already targets /admin/*.
 * - Non-admins default to /dashboards/home; honor a safe return path (not /login).
 */
export function getPostLoginPath(user, locationState) {
  const role = String(user?.role ?? '').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const returnPath = locationState?.path;

  if (isAdmin) {
    if (typeof returnPath === 'string' && returnPath.startsWith('/admin')) {
      return returnPath;
    }
    return '/admin/dashboard';
  }

  if (
    typeof returnPath === 'string' &&
    returnPath.length > 0 &&
    returnPath !== '/login' &&
    !returnPath.startsWith('/login')
  ) {
    return returnPath;
  }

  return '/dashboards/home';
}
