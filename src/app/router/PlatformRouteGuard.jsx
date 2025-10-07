import { apiConfig } from 'configs/api.config';

const toLower = (s) => (s ?? '').toLowerCase();
export function platformGuard(allowed) {
  return () => {
    const current = toLower(apiConfig.platformType);
    const allow = allowed.map(toLower);
    if (!allow.includes(current)) {
      throw new Response('Not Found', { status: 404 });
    }
    return null;
  };
}
