const changeSchema = {
  action: "",
  payload: {
    timestamp: "", // Always store UTC
    oldValue: null,
    newValue: null,
  },
  fields: {
    readPages: 0,
    progressUpdateStartType: "",
    progressUpdateEndType: "",
  },
};

const makeChange = (action, change) => {
  let newChange = Object.assign({}, changeSchema);
  newChange.action = action;
  newChange.payload = {
    timestamp: Date.now(),
    oldValue: change.oldValue,
    newValue: change.newValue,
    duration: change.duration ? change.duration : 0,
  };
  return newChange;
};

const makeChangeFromForm = (action, form) => {
  let newChange = Object.assign({}, changeSchema);
  newChange.action = action;
  newChange.payload.timestamp = Date.now();
  switch (action) {
    case "updatePage":
      newChange.payload = {
        timestamp: Date.now(),
        oldValue: form.startAt,
        newValue: form.endAt,
        duration: form.duration ? form.duration : 0,
      };
      newChange.fields.readPages = form.endAt;
      newChange.fields.progressUpdateStartType = form.startType;
      newChange.fields.progressUpdateEndType = form.endType;
      break;
    default:
      break;
  }
  return newChange;
};

const addChangeToBook = (book, change) => {
  if (book.changes?.length) {
    book.changes.unshift(change);
  } else {
    book.changes = [change];
  }
  book.changes.sort((a, b) => {
    return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
  });
  return book;
};

export default {
  makeChange,
  makeChangeFromForm,
  addChangeToBook,
};
