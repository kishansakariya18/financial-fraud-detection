import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const campaignStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'active';
    case 0:
      return 'inactive';
    default:
      return 'inactive';
  }
};

export const campaignStatusOptions = [
  { value: 'active', label: 'Active', color: 'success', icon: CheckBadgeIcon },
  { value: 'inactive', label: 'Inactive', color: 'error', icon: XCircleIcon }
];

// Maps API response (object with data.Camapgns and totalRecords) into app rows
export const campaignsResponseMapper = (apiData) => {
  let campaigns = [];
  if (Array.isArray(apiData?.data?.Camapgns)) {
    campaigns = apiData.data.Camapgns;
  } else if (Array.isArray(apiData?.Camapgns)) {
    campaigns = apiData.Camapgns;
  }
  const list = campaigns.map((item) => ({
    CampaignName: item.CampaignName,
    DateCreated: item.DateCreated || '',
    CampaignStatus: item.CampaignStatus,
    CampaignCode: item.CampaignCode,
    CampaignLink: item.CampaignLink,
    affiliates: item.affiliates,
    campaignStats: item.campaignStats,
    _statusApp: campaignStatusToApp(item.CampaignStatus)
  }));
  const totalRecords = apiData?.totalRecords ?? list.length;
  return { list, totalRecords };
};
