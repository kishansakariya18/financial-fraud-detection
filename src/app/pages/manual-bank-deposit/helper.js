export const parseAdminStatusToApp = (status) => (status ? 'active' : 'inactive');

export const parseAdminStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.CountryID,
    countryName: data.CountryName,
    countryCode: data.CountryCode,
    status: parseAdminStatusToApp(data.IsActive)
  }));
  return resultData;
};
