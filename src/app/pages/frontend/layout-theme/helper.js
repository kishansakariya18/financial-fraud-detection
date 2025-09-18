export const layoutThemeResponseMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.LayoutThemeID,
    name: item?.layout.Name,
    themeName: item.ThemeName,
    status: parseAppearanceStatusToApp(item.IsActive),
    createdAt: item.CreatedAt
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
export const layoutThemeTypeOptions = [
  {
    label: 'Colour Code',
    value: 1
  },
  {
    label: 'Colour Picker',
    value: 2
  }
];
