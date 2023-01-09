import moment from "moment";
import { dateToSpecificFormat } from "./dateFormat";

export const getDOBOnYearChange = (AgeYear, AgeMonth) => {
  var cntOfYears = AgeYear && AgeYear !== "0" && AgeYear !== "00" ? AgeYear : "";
  var birthDate = moment()
    .subtract(cntOfYears, "years")
    .subtract(AgeMonth ? AgeMonth : "", "months")
    .subtract(0, "days");
  var newdate = dateToSpecificFormat(birthDate, "YYYY-MM-DD");
  console.log(newdate);
  return newdate;
};

export const getDOBOnMonthChange = (AgeMonth, AgeYear) => {
  var birthDate = moment()
    .subtract(AgeYear ? AgeYear : "", "years")
    .subtract(AgeMonth, "months")
    .subtract(0, "days");
  var newdate = dateToSpecificFormat(birthDate, "YYYY-MM-DD");
  console.log(newdate);
  return newdate;
};

export const getAgeYear = (dateString) => {
  var birthDate = new Date(dateString);
  var m = Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970);
  return m;
};

export const getAgeMonth = (dateString) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var m =
    today.getMonth() - birthDate.getMonth() < 0
      ? today.getMonth() - birthDate.getMonth() + 12
      : today.getMonth() - birthDate.getMonth() === 0
      ? today.getDate() - birthDate.getDate() < 0
        ? "11"
        : "0"
      : today.getMonth() - birthDate.getMonth();
  return m;
};

export const getDateSplitter = (dateString) => {
  var m = dateString ? dateString.split("T")[0] : "";
  return m;
};

export const getAgeCalculatedFromDOB = (dateofBirth, withlabel) => {
  const dateString = dateofBirth;
  const now = new Date();

  const yearNow = now.getFullYear();
  const monthNow = now.getMonth();
  const dateNow = now.getDate();

  const dob = new Date(dateString);

  const yearDob = dob.getFullYear();
  const monthDob = dob.getMonth();
  const dateDob = dob.getDate();

  let yearAge = yearNow - yearDob;
  let monthAge;

  if (monthNow >= monthDob) {
    monthAge = monthNow - monthDob;
  } else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  let dateAge;

  if (dateNow >= dateDob) {
    dateAge = dateNow - dateDob;
  } else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  const age = {
    years: yearAge ? yearAge : "",
    months: monthAge ? monthAge : "",
    days: dateAge ? dateAge : "",
  };

  if (withlabel === true) {
    return (age.years ? age.years : "00") + "Y " + (age.months ? parseInt(age.months) : "00") + "M " + (age.days ? age.days : "00") + "D";
  }

  return age.days + "." + age.months + "." + age.years;
};

export const getDOBCalculatedFromAge = (day, month, year) => {
  var birthDate = moment()
    .subtract(day ? day : 0, "days")
    .subtract(month ? month : 0, "months")
    .subtract(year ? year : 0, "years");

  var newdate = dateToSpecificFormat(birthDate, "YYYY-MM-DD");
  console.log(newdate, "DOBCalculatedFromAge");

  return newdate;
};

export const getAgeCalculatedFromDOBWithLabel = (dateofBirth) => {
  return getAgeCalculatedFromDOB(dateofBirth, true);
};
