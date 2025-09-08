import { getDateInUTCToTimeZone } from 'helpers/functions';

export const parseBlacklistStatusToApp = (is_active) => (is_active ? 'active' : 'inactive');

/**
 * Response mapper for IP blacklist API
 * @param {Array} apiData - The array of API data objects.
 * @returns {Array} - Mapped array for table consumption.
 */
export const ipResponseMapper = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((data) => ({
    id: data.id,
    ip: data.value,
    reason: data.reason,
    status: parseBlacklistStatusToApp(data.is_active),
    createdAt: getDateInUTCToTimeZone(data.created_at),
    blockType: data.blockType.charAt(0).toUpperCase() + data.blockType.slice(1),
    uid: data.uid
  }));
};

export const entityResponseMapper = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((data) => ({
    id: data.id,
    value: data.value,
    reason: data.reason,
    status: parseBlacklistStatusToApp(data.is_active),
    createdAt: getDateInUTCToTimeZone(data.created_at),
    blockType: data.blockType.charAt(0).toUpperCase() + data.blockType.slice(1),
    uid: data.uid
  }));
};
export const disposablEmailResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.RestrictedEmailDomainID,
    emailDomain: data.Domain,
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};
