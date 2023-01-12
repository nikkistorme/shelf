const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (date) => {
  const dateObject = new Date(date);
  const dateMonth = months[dateObject.getMonth()];
  const dateDate = dateObject.getDate();
  const dateYear = dateObject.getFullYear();
  const dateString = `${dateMonth} ${dateDate} ${dateYear}`;
  return dateString;
};

export const getTimeString = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const nowTime = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
  return nowTime;
};

export const HhMmDifferenceInMinutes = (time1, time2) => {
  const start = new Date(`1111-11-11 ${time1}`);
  const end = new Date(`1111-11-11 ${time2}`);
  const diffMilliseconds = end - start;
  const diffMinutes = Math.round(
    ((diffMilliseconds % 86400000) % 3600000) / 60000
  );
  return diffMinutes;
};

export const todayWithFormat = (format) => {
  let formatted = format;
  const date = new Date();
  if (format.includes("YYYY")) {
    const year = date.getFullYear();
    formatted = formatted.replace("YYYY", year);
  }
  if (format.includes("MM")) {
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    formatted = formatted.replace("MM", month);
  }
  if (format.includes("DD")) {
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    formatted = formatted.replace("DD", day);
  }
  return formatted;
};

export const dateWithFormatToTimestampz = (date, format) => {
  let timestampz;
  let dateObject;
  let year;
  let month;
  let day;
  switch (format) {
    case "YYYY-MM-DD":
      year = date.slice(0, 4);
      month = date.slice(5, 7);
      day = date.slice(8, 10);
      if (day[0] === "0") {
        day = (parseInt(day) + 1).toString();
      }
      dateObject = new Date(`${year}-${month}-${day}`.replace(/-/g, "/"));
      break;
    default:
      break;
  }
  timestampz = dateObject.toISOString();
  return timestampz;
};

export const formatDateFromTimestampz = (timestampz, format) => {
  const date = new Date(timestampz);
  let year;
  let month;
  let day;
  switch (format) {
    case "YYYY-MM-DD":
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    default:
      return timestampz;
  }
};
