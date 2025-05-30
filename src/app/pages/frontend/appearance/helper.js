export const appearanceResponse = (apiData) => {
  return apiData.map((item) => ({
    id: item.AppearanceID,
    name: item.Name,
    themePreview: [
      item.PrimaryColor,
      item.SecondaryColor,
      item.FontColor1,
      item.FontColor2,
      item.FontColor3,
      item.FontColor4
    ],
    primaryColor: item.PrimaryColor,
    secondaryColor: item.SecondaryColor,
    fontColor1: item.FontColor1,
    fontColor2: item.FontColor2,
    fontColor3: item.FontColor3,
    fontColor4: item.FontColor4,
    status: parseAppearanceStatusToApp(item.IsActive),
    createdAt: item.DateCreated,
    modifiedAt: item.DateModified
  }));
};

export const parseAppearanceStatusToApp = (isActive) => {
  return isActive === 1 ? 'active' : 'inactive';
};

export const parseAppearanceStatusToApi = (status) => {
  if (typeof status !== 'string') return 0;
  return status.toLowerCase() === 'active' ? 1 : 0;
};

export const appearanceStatusOptions = [
  {
    label: 'Active',
    value: 'active',
    color: 'success'
  },
  {
    label: 'Inactive',
    value: 'inactive',
    color: 'error'
  }
];
