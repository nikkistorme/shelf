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
  user: ""
};

const shelf = {
  id: "",
  name: "",
  user: ""
};

const user = {
  activeShelf: "",
  id: "",
  name: ""
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

export default {
  book,
  shelf,
  user,
  stringFromArrayOfStrings
};
