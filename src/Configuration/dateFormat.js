import { getSessionStorage } from '../API methods/AUTH/Auth';
import moment from 'moment';


export const stringToDate = (_date, _format, _delimiter) => {
  const formatLowerCase = _format.toLowerCase();
  const formatItems = formatLowerCase.split(_delimiter);
  const dateItems = _date.split(_delimiter);
  const monthIndex = formatItems.indexOf('mm');
  const dayIndex = formatItems.indexOf('dd');
  const yearIndex = formatItems.indexOf('yyyy');
  let month = parseInt(dateItems[monthIndex]);
  month -= 1;
  const formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
  return formatedDate;
};

export const formatDate = (date) => {
  try {
    const d = new Date(date);
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
  } catch {
    return null;
  }
};

export const dateToSpecificFormat = (date, format) => {
  try {
    const d = new Date(date);
    const convertedDate = moment(d).format(format);
    return convertedDate;
  } catch {
    return null;
  }
};

export const dateToCompanyFormat = (date) => {
  try {
    const user = getSessionStorage('user');
    if (user && user.UserData && user.UserData.DateShort) {
      const format = user.UserData.DateShort.toUpperCase();
      const d = new Date(date);
      const convertedDate = moment(d).format(format);
      return convertedDate;
    }
    return '';
  } catch {
    return '';
  }
};

export const datetimeToCompanyFormat = (date) => {
  debugger
  try {
    const user = getSessionStorage('user');
    if (user && user.UserData && user.UserData.DateLong) {
      const format = user.UserData.DateLong.toUpperCase();
      const d = new Date(date);
      const convertedDate = moment(d).format(format);
      return convertedDate;
    }
    return '';
  } catch {
    return '';
  }
};

export const dateTimeCompanyFormat = (input) => {
  debugger
  try {
    const user = getSessionStorage('user');
    if (user && user.UserData && user.UserData.DateLong) {
      const res = input.split("T", 1);
      const res2 = input.split("T", 2);
      var datePart = res[0].match(/\d+/g),
          year = datePart[0], // get only two digits
          month = datePart[1], day = datePart[2];

      var datePart2 = res2[1].match(/\d+/g), hour = datePart2[0], min = datePart2[1], sec = datePart2[2];

      return day + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
    }
    return '';
  } catch {
    return '';
  }
};

export const getDatesRange = (startDate, endDate) => {

  try {
    let dates = []
  //to avoid modifying the original date
  const user = getSessionStorage('user');
  if (user && user.UserData && user.UserData.DateLong) {
  const theStartDate = new Date(startDate)
  const theEndDate = new Date(endDate)
  const format = user.UserData.DateShort.toUpperCase();
  while (theStartDate < theEndDate) {
    const convertedStartDate = moment(theStartDate).format(format);
    dates = [...dates, convertedStartDate]
    theStartDate.setDate(theStartDate.getDate() + 1)
    
  }
  const convertedEndDate = moment(theEndDate).format(format);
  dates = [...dates, convertedEndDate]
  return dates
   }
   return [];
  } catch {
    return '';
  }
}

export const tConvert = (time)=> {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

