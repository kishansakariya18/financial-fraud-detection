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

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
