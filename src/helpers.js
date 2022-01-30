const book = {
  author: "",
  description: "",
  finished: "",
  goalDate: "",
  goalToday: {
    date: "",
    page: 0
  },
  id: "",
  image: "",
  inProgress: false,
  readPages: 0,
  shelves: [],
  startDate: "",
  title: "",
  totalPages: 0,
  user: "",
  changes: []
};

const blankChange = {
  action: "",
  payload: {
    timestamp: "", // Always store UTC
    oldValue: null,
    newValue: null
  }
};

const shelf = {
  id: "",
  name: "",
  user: "",
  changes: []
};

const user = {
  activeShelf: "",
  id: "",
  name: "",
  changes: []
};

const stringFromArrayOfStrings = array => {
  let newString = "";
  let i;
  for (i = 0; i < array.length; i++) {
    if (!newString.length) {
      newString = array[i];
    } else {
      newString += `, ${array[i]}`;
    }
  }
  return newString;
};

const addChange = (action, change) => {
  let newChange = Object.assign({}, blankChange);
  newChange.action = action;
  newChange.payload = {
    timestamp: Date.now(),
    oldValue: change.oldValue,
    newValue: change.newValue,
    duration: change.duration ? change.duration : 0
  };
  return newChange;
};

const formatTimestamp = timestamp => {
  let date = new Date(timestamp);
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
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
    "December"
  ];
  return `
    ${weekDays[date.getDay()]} 
    ${months[date.getMonth()]} 
    ${date.getDate()}, 
    ${date.getHours()}:${date.getMinutes() > 9 ? "" : 0}${date.getMinutes()} 
    ${date.getHours() >= 12 ? "pm" : "am"}`;
};

export default {
  book,
  blankChange,
  shelf,
  user,
  stringFromArrayOfStrings,
  addChange,
  formatTimestamp
};
