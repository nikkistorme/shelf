export const changeSchema = () => {
  let change = {
    action: "",
    created: null,
    payload: {
      timestamp: "", // Always store UTC
      oldValue: null,
      newValue: null,
    },
    fields: {
      readPages: null,
      progressUpdateStartType: null,
      progressUpdateEndType: null,
      goal: {
        startDate: null,
        goalDate: null,
        targetPage: null,
      },
      finishedDate: null,
      inProgress: null,
      shelf: null,
    },
  };
  return change;
};

export const makeChange = (action, change) => {
  let newChange = changeSchema();
  newChange.action = action;
  newChange.created = new Date().toISOString();
  newChange.payload = {
    timestamp: Date.now(),
    oldValue: change.oldValue,
    newValue: change.newValue,
    duration: change.duration ? change.duration : 0,
  };
  switch (action) {
    case "addToShelf":
    case "removeFromShelf":
      newChange.fields.shelfName = change.fields.shelfName;
      break;
    case "updateField":
      newChange.fields[change.field] = change.newValue;
      newChange.fields.fieldName = change.field;
      break;
    case "startReading":
      newChange.fields.inProgress = true;
      newChange.fields.readPages = 0;
      break;
    default:
      break;
  }
  return newChange;
};

export const makeChangeFromForm = (action, form, oldValue = null) => {
  let newChange = changeSchema();
  newChange.action = action;
  newChange.created = new Date().toISOString();
  newChange.payload.timestamp = Date.now();
  console.log("🚀 ~ form.duration", form.duration);
  switch (action) {
    case "updatePage":
      newChange.payload = {
        timestamp: Date.now(),
        oldValue: form.startAt,
        newValue: form.endAt,
        duration: form.duration > 0 ? form.duration : 0,
      };
      newChange.fields.readPages = form.endAt;
      newChange.fields.progressUpdateStartType = form.startType;
      newChange.fields.progressUpdateEndType = form.endType;
      break;
    case "setGoal":
      newChange.payload = {
        timestamp: Date.now(),
        oldValue: oldValue,
        newValue: form,
      };
      newChange.fields.goal.startDate = Date.now();
      newChange.fields.goal.goalDate = form.goalDate;
      newChange.fields.goal.targetPage = form.targetPage;
      break;
    case "finishReading":
      newChange.payload = {
        timestamp: Date.now(),
        oldValue: oldValue,
        newValue: new Date().toISOString(),
      };
      newChange.fields.finished = true;
      newChange.fields.readPages = form.endAt;
      newChange.fields.inProgress = false;
      newChange.fields.goal.startDate = 0;
      newChange.fields.goal.goalDate = 0;
      newChange.fields.goal.targetPage = 0;
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
  makeChangeFromForm,
  addChangeToBook,
};
