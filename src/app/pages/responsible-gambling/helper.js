import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';

export const listResponseMapper = (apiResponse) => {
  const dataArr = apiResponse?.data || apiResponse?.Data || [];
  return dataArr.map((item) => ({
    id: item?.ResponsibleGamingRestrictionID || item?.Id || item?.ID,
    title: item?.RestrictionType || item?.RestrictionType || item?.RestrictionType,
    setBy: capitalizeFirstLetter(item?.SetBy) || '-',
    firstName: item?.user?.FirstName ?? item?.user?.first_name ?? '-',
    lastName: item?.user?.LastName ?? item?.user?.last_name ?? '-',
    email: item?.user?.Email ?? item?.user?.email ?? '-',
    userName: item?.user?.Username ?? item?.user?.username ?? '-',
    status: statusToAPP(item?.Status),
    createdAt: item?.DateCreated ? getDateInUTCToTimeZone(item?.DateCreated) : undefined,
    updatedAt: item?.DateModified ? getDateInUTCToTimeZone(item?.DateModified) : undefined,
    approvedAt: item?.ApprovedAt ? getDateInUTCToTimeZone(item?.ApprovedAt) : null,
    expireAt: item?.EndDate ? getDateInUTCToTimeZone(item?.EndDate) : undefined
  }));
};

export const statusToAPP = (status) => {
  if (status === 'active') return 'active';
  if (status === 'expired') return 'expired';
  if (status === 'inactive') return 'inactive';
  return 'inactive';
};

export const rgStatusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  },
  {
    value: 'expired',
    label: 'Expired',
    color: 'error',
    icon: XCircleIcon
  }
];
