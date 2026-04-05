import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

/** Stable id for API payloads (e.g. transaction categoryId). */
export function getCategoryEntityId(item) {
  if (item == null) return null;
  return item._id ?? item.id ?? item.categoryId ?? null;
}

export function isSystemCategoryItem(item) {
  if (item == null) return false;
  if (item.isSystem === true || item.isDefault === true) return true;
  const scope = String(item.scope ?? item.source ?? '').toLowerCase();
  return scope === 'system' || scope === 'default';
}

/**
 * Normalizes GET /categories into a single deduped list (user + system shapes supported).
 */
export function mergeCategoryListsFromApiResponse(result) {
  if (!result || result.status !== 200) return [];
  const body = result.response;
  const raw = body?.data !== undefined ? body.data : body;
  let combined = [];

  if (
    raw &&
    typeof raw === 'object' &&
    !Array.isArray(raw) &&
    (raw.userCategories || raw.systemCategories)
  ) {
    combined = [
      ...(Array.isArray(raw.userCategories) ? raw.userCategories : []),
      ...(Array.isArray(raw.systemCategories) ? raw.systemCategories : [])
    ];
  } else if (Array.isArray(raw)) {
    combined = raw;
  } else if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.items)) combined = raw.items;
    else if (Array.isArray(raw.categories)) combined = raw.categories;
  }

  const seen = new Set();
  return combined.filter((c) => {
    const id = getCategoryEntityId(c);
    if (id == null || id === '') return false;
    const key = String(id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const CategoryService = {
  getCategories: async () => {
    const endPoint = apiConfig.endPoints.USER.CATEGORIES;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    return sendRequest({
      url: apiURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  /**
   * If your API does not implement this route, the UI falls back to items
   * marked as system/default from the main categories response.
   */
  getSystemCategories: async () => {
    const endPoint = apiConfig.endPoints.USER.CATEGORIES_SYSTEM;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    return sendRequest({
      url: apiURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  createCategory: async (data) => {
    const endPoint = apiConfig.endPoints.USER.CATEGORIES;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    return sendRequest({
      url: apiURL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  },

  updateCategory: async (id, data) => {
    const endPoint = `${apiConfig.endPoints.USER.CATEGORIES}/${id}`;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    return sendRequest({
      url: apiURL,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  }
};

export default CategoryService;
