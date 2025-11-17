// utils/formData.js

const isFileLike = (value) =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob);

/**
 * Convert a plain object into FormData.
 * - Primitives → string
 * - Arrays → key[]
 * - Objects → JSON string
 * - File / Blob → as-is
 */
export function objectToFormData(obj) {
  const formData = new FormData();

  const appendValue = (key, value) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (isFileLike(value)) {
      // File / Blob
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Arrays → key[]
      value.forEach((item) => {
        if (isFileLike(item)) {
          formData.append(key + '[]', item);
        } else if (typeof item === 'object' && item !== null) {
          formData.append(key + '[]', JSON.stringify(item));
        } else {
          formData.append(key + '[]', String(item));
        }
      });
    } else if (typeof value === 'object') {
      // Objects → JSON string
      formData.append(key, JSON.stringify(value));
    } else {
      // string / number / boolean
      formData.append(key, String(value));
    }
  };

  Object.entries(obj || {}).forEach(([key, value]) => {
    appendValue(key, value);
  });

  return formData;
}
