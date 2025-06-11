import { getDateInUTCToTimeZone } from 'helpers/functions';

export const referralOfferResponseMapper = (apiData) => {
  return apiData?.map((item) => {
    return {
      id: item.OfferID,
      type: item.Type,
      name: item.Name,
      userReal: item.UserReal,
      userBonus: item.UserBonus,
      userCoin: item.UserCoin,
      friendReal: item.FriendReal,
      friendBonus: item.FriendBonus,
      friendCoin: item.FriendCoin,
      status: item.IsActive,
      withoutReferral: item.WithoutReferral,
      dateCreated: getDateInUTCToTimeZone(item.DateCreated),
      dateModified: getDateInUTCToTimeZone(item.DateModified)
    };
  });
};
