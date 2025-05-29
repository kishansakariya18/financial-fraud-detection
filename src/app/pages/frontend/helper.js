import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { HOME_CATEGORY_STATUS, HOME_GAME_STATUS } from 'constants/app.constant';

export const homeCategoryResponse = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.HomePageCategoryID,
      category: data.category.Name,
      categoryId: data.CategoryID,
      orderNumber: data.OrderNumber,
      status: parseHomeCategoryStatusToApp(data.IsActive)
    };
  });
};
export const homeGamesResponse = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.homeGame.HomePageGameID,
      gameId: data.GameID,
      gameName: data.Name,
      status: parseHomeCategoryStatusToApp(data.homeGame.IsActive)
    };
  });
};
export const addHomeGameReponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.GameID,
      gameName: data.Name
    };
  });
};

export const parseHomeCategoryStatusToApp = (status) => {
  switch (+status) {
    case HOME_CATEGORY_STATUS.ACTIVE:
      return 'active';
    case HOME_CATEGORY_STATUS.INACTIVE:
      return 'inactive';
    default:
      break;
  }
};

export const parseHomeGameStatusToApp = (status) => {
  switch (+status) {
    case HOME_GAME_STATUS.ACTIVE:
      return 'active';
    case HOME_GAME_STATUS.INACTIVE:
      return 'inactive';
    default:
      break;
  }
};

export const parseHomeGameStatusToApi = (status) => {
  switch (status) {
    case 'active':
      return HOME_GAME_STATUS.ACTIVE;
    case 'inactive':
      return HOME_GAME_STATUS.INACTIVE;
    default:
      break;
  }
};

export const parseHomeCategoryStatusToApi = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    default:
      break;
  }
};

export const homeCategoryStatusOptions = [
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
export const homeGameStatusOptions = [
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
