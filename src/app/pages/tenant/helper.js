import { getDateInUTCToTimeZone } from 'helpers/functions';

export const tenantStatusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success'
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error'
  }
];
export const servicesOptions = [
  {
    value: 'casino',
    label: 'Casino'
  },
  {
    value: 'sportbook',
    label: 'Sport Book'
  }
];

export const parseTenantStatusToAPP = (status) => {
  return +status === 1 ? 'active' : 'inactive';
};
export const parseTenantStatusToAPI = (status) => {
  return status === 'active' ? 1 : 0;
};

export const parseServiceToAPP = (serviceType) => {
  return +serviceType === 1 ? 'casino' : 'sportbook';
};
export const parseServiceToAPI = (serviceType) => {
  return serviceType === 'casino' ? 1 : 2;
};

export const tenantListResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.TenantID,
    tenantUID: data.TenantUID,
    username: data.Username,
    firstname: data.FirstName,
    lastname: data.LastName,
    mobile: data.Mobile,
    service: parseServiceToAPP(data.Service),
    email: data.Email,
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    status: parseTenantStatusToAPP(data.IsActive)
  }));
  return resultData;
};
