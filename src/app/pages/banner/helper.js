import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { BANNER } from 'constants/app.constant';
import { getDateInUTCToTimeZone } from 'helpers/functions';
export const parseBannerStatus = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
    case 2:
      return 'deleted';
    default:
      return 'not found';
  }
};
export const promocodeStateOptions = [
  {
    value: 'available',
    label: 'Available'
  },
  {
    value: 'expired',
    label: 'Expired'
  }
];

export const statusOptions = [
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
  }
];

export const parseBannerStatusToApi = (status) => {
  let apiStatus = '';
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  } else if (status === 'deleted') {
    apiStatus = 2;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.BannerID,
    name: data.BannerName,
    status: parseBannerStatus(data.IsActive),
    headline: data?.bannerContent[0]?.HeadLine || '-',
    startDate: getDateInUTCToTimeZone(data.StartDate),
    endDate: getDateInUTCToTimeZone(data.EndDate),
    hasUserSegmentation: data.HasUserSegmentation ? 1 : 0
  }));
  return resultData;
};

export const placementTypeOptions = [{ value: BANNER.TYPE.LOBBY_BANNER, label: 'Lobby Banner' }];
