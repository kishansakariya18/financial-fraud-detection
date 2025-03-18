export function getQueryParams(searchParams) {
    const result = Object.fromEntries([...searchParams]);
    return result;
  }


  export function isEmptyObject(obj) {
    return !(Object.keys(obj).length > 0);
  }
  



  export function replaceText(text, replaceTo, replaceWith) {
    var regex = new RegExp(replaceTo, 'g');
    return text.replace(regex, replaceWith);
  }
  