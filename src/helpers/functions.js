import moment from 'moment-timezone';

export function getDateInUTCToTimeZone(
  date,
  timeZone = getTimezone(),
  dateFormat = 'DD MMM YYYY hh:mm A'
) {
  return moment.utc(date).tz(timeZone).format(dateFormat);
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getStartDate(date) {
  console.log('sttime', date);
  return moment.utc(+date).format('YYYY-MM-DD HH:mm');
}
export function getEndDate(date) {
  console.log('endtime', date);
  return moment(+date).utc().add(1, 'day').subtract(1, 'second').format('YYYY-MM-DD HH:mm');
}

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
