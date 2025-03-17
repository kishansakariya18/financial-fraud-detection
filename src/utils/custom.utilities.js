export function getQueryParams(searchParams) {
    const result = Object.fromEntries([...searchParams]);
    return result;
  }


  export function isEmptyObject(obj) {
    return !(Object.keys(obj).length > 0);
  }
  