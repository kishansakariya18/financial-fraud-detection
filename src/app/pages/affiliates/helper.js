import { getDateInUTCToTimeZone } from 'helpers/functions';

const statusToApp = (status) => {
  switch ((status || '').toString().toUpperCase()) {
    case 'ACTIVE':
      return 'active';
    case 'INACTIVE':
      return 'inactive';
    case 'BLOCKED':
      return 'blocked';
    case 'DEACTIVATED':
      return 'deactivated';
    default:
      return 'inactive';
  }
};

export const affiliatesListResponseMapper = (payload) => {
  const data = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const list = data.map((item, idx) => {
    const user = item?.User || {};
    return {
      id: idx + 1,
      affiliateUID: item?.AffiliateUID || '-',
      email: user?.Email || '-',
      firstName: user?.FirstName ?? '-',
      lastName: user?.LastName ?? '-',
      username: user?.Username || '-',
      mobile: user?.Mobile || '-',
      status: statusToApp(item?.Status),
      createdAt: item?.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '-'
    };
  });
  const totalPages = Array.isArray(payload) ? 0 : payload?.totalPages || 0;
  const totalRecords = Array.isArray(payload)
    ? data.length || 0
    : payload?.totalRecords || data.length || 0;
  return { totalPages, totalRecords, list };
};
