import moment from "moment-timezone";

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


  export const ConvertDateIntoUTC = (date) => {
    console.log('typeoftypeoftypeof<<>>', typeof date, '   ', date);
    if (date) {
      if (typeof date == 'string') {
        date = moment(date);
      }
      return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return '';
  };
  