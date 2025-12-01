import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const campaignListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.CampaignID,
      campaignUID: item?.CampaignUID,
      name: item?.CampaignName,
      status: campaignStatusToAPP(item?.Status),
      startDate: getDateInUTCToTimeZone(item?.StartDate),
      endDate: getDateInUTCToTimeZone(item?.EndDate),
      description: item?.Description,
      tags: item?.Tags || [],
      createdAt: getDateInUTCToTimeZone(item?.DateCreated),
      dateModified: getDateInUTCToTimeZone(item?.DateModified),
      admin: item?.admin?.Username
    };
  });
  return { list, totalRecords };
};

export const campaignStatusToAPP = (status) => {
  if (status === 0 || status === 'inactive') {
    return 'inactive';
  } else if (status === 1 || status === 'active') {
    return 'active';
  }
  return 'inactive';
};

export const campaignStatusToAPI = (status) => {
  if (status === 'inactive') {
    return 0;
  } else if (status === 'active') {
    return 1;
  }
  return undefined;
};

export const campaignStatusOptions = [
  {
    key: 'active',
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'inactive',
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];
