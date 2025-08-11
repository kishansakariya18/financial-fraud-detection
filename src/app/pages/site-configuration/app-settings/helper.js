// Helpers for Application Settings page
// Mirrors the structure used in `src/app/pages/roles/helper.js`

/**
 * Simple i18n translator wrapper
 * @param {Function} t - i18next translation function
 * @param {string} text - translation key
 * @param {string|string[]} [ns] - namespace(s)
 * @returns {string}
 */
export const translator = (t, text, ns) => t(`${text}`, { ns });

/**
 * Map API list response to UI table-friendly rows
 * @param {Array<Object>} apiData - e.g. response.data from the API
 * @returns {Array<Object>} rows for table/list views
 */
export const responseMapper = (apiData = []) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => ({
    id: item?.SettingID,
    name: item?.Name,
    key: item?.Key,
    value: item?.Value,
    valueType: item?.ValueType
  }));
};

/**
 * Map a single API item to a detail view shape
 * @param {Object} apiData - a single setting item
 * @returns {Object} normalized detail object
 */
export const detailMapper = (apiData = {}) => ({
  id: apiData?.SettingID,
  name: apiData?.Name,
  key: apiData?.Key,
  value: apiData?.Value,
  valueType: apiData?.ValueType
});
