import dayjs from 'dayjs';
import moment from 'moment-jalaali';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);


export function today(format) {
  return dayjs(new Date()).startOf('day').format(format);
}

/** output: 17 Apr 2022
 */
export function fDateTime(date, format) {
  if (!date) {
    return null;
  }

  const isValid = moment(date).isValid();

  return isValid ? moment(date).format(format ?? 'jDD jMMM jYYYY h:mm a') : 'Invalid time value';
}

// ----------------------------------------------------------------------

export function fDate(date, format) {
  if (!date) {
    return null;
  }

  const isValid = moment(date).isValid();

  return isValid ? moment(date).format(format ?? 'jYYYY-jMM-jDD') : 'Invalid time value';
}

// ----------------------------------------------------------------------

export function fTime(date, format) {
  if (!date) {
    return null;
  }

  const isValid = moment(date).isValid();

  return isValid ? moment(date).format(format ?? 'h:mm a') : 'Invalid time value';
}


// ----------------------------------------------------------------------

/** output: 1713250100
 */
export function fTimestamp(date) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 */
export function fToNow(date) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).toNow(true) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsBetween(inputDate, startDate, endDate) {
  if (!inputDate || !startDate || !endDate) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (formattedInputDate && formattedStartDate && formattedEndDate) {
    return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
  }

  return false;
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsAfter(startDate, endDate) {
  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsSame(startDate, endDate, units) {
  if (!startDate || !endDate) {
    return false;
  }

  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  if (!isValid) {
    return 'Invalid time value';
  }

  return dayjs(startDate).isSame(endDate, units ?? 'year');
}

// ----------------------------------------------------------------------

/** output:
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */
export function fDateRangeShortLabel(startDate, endDate) {
  if (startDate && endDate) {
    return `${moment(startDate).format("jYYYY/jMM/jDD")} - ${moment(endDate).format("jYYYY/jMM/jDD")}`;
  }
  if (startDate) {
    return `${moment(startDate).format("jYYYY/jMM/jDD")}`;
  }
  if (endDate) {
    return `${moment(endDate).format("jYYYY/jMM/jDD")}`;
  }
  return "";
}

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}
