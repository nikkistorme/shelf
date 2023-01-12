export const updateSchema = () => {
  return {
    field: "",
    oldValue: null,
    newValue: null,
    newValueSoft: null,
  };
};

export const changeSchema = () => {
  let change = {
    action: "",
    created: "",
    updates: [],
  };
  return change;
};

const getNewUpdate = (action, field, book, misc = null) => {
  let newUpdate = updateSchema();
  newUpdate.field = field;
  switch (field) {
    case "in_progress":
      newUpdate.oldValue = book.status;
      if (action === "startReadingBook") {
        newUpdate.newValue = true;
      } else if (action === "finishReadingBook") {
        newUpdate.newValue = false;
      }
      break;
    case "current_page":
      newUpdate.oldValue = book.current_page ? book.current_page : 0;
      if (action === "startReadingBook") {
        newUpdate.newValue = 0;
      } else if (["updateProgress", "finishReadingBook"].includes(action)) {
        newUpdate.newValue = misc.endAt;
      }
      break;
    case "duration":
      newUpdate.newValue = misc.duration;
      break;
    case "goal":
      newUpdate.oldValue = misc.oldGoal;
      if (action === "setGoal") {
        newUpdate.newValue = {
          targetPage: misc.targetPage,
          goalDate: misc.goalDate,
          startDate: new Date().toISOString(),
        };
      } else if (action === "removeGoal") {
        newUpdate.newValue = null;
      }
      break;
    case "finished":
      newUpdate.oldValue = book.finished;
      newUpdate.newValue = true;
      break;
    case "cover":
      newUpdate.oldValue = book.cover;
      newUpdate.newValue = misc.cover;
      break;
    case "total_pages":
      newUpdate.oldValue = book.total_pages;
      newUpdate.newValue = misc.total_pages;
      break;
    default:
      break;
  }
  return newUpdate;
};

export const newChange = (action, book, misc = null) => {
  let newChange = changeSchema();
  newChange.action = action;
  newChange.created = new Date().toISOString();
  switch (action) {
    case "startReadingBook":
      newChange.updates.push(
        getNewUpdate("startReadingBook", "in_progress", book)
      );
      newChange.updates.push(
        getNewUpdate("startReadingBook", "current_page", book)
      );
      break;
    case "updateProgress":
      newChange.updates.push(
        getNewUpdate("updateProgress", "current_page", book, misc)
      );
      if (misc.duration)
        newChange.updates.push(
          getNewUpdate("updateProgress", "duration", book, misc)
        );
      break;
    case "setGoal":
      newChange.updates.push(getNewUpdate("setGoal", "goal", book, misc));
      break;
    case "removeGoal":
      newChange.updates.push(getNewUpdate("removeGoal", "goal", book, misc));
      break;
    case "finishReadingBook":
      newChange.updates.push(
        getNewUpdate("finishReadingBook", "current_page", book, misc)
      );
      newChange.updates.push(
        getNewUpdate("finishReadingBook", "in_progress", book, misc)
      );
      newChange.updates.push(
        getNewUpdate("finishReadingBook", "finished", book)
      );
      if (misc.duration)
        newChange.updates.push(
          getNewUpdate("finishReadingBook", "duration", book, misc)
        );
      if (misc.oldGoal)
        newChange.updates.push(
          getNewUpdate("finishReadingBook", "goal", book, misc)
        );
      break;
    case "updateCover":
      newChange.updates.push(getNewUpdate("updateCover", "cover", book, misc));
      break;
    case "updateTotalPages":
      newChange.updates.push(getNewUpdate(action, "total_pages", book, misc));
      break;
    default:
      break;
  }
  return newChange;
};

export const newChangeFromForm = (action, book, form) => {
  let newChange = changeSchema();
  newChange.action = action;
  newChange.created = new Date().toISOString();
  switch (action) {
    default:
      break;
  }
  return newChange;
};

export const sortChanges = (changes) => {
  return changes.sort((a, b) => {
    return a.created > b.created ? -1 : 1;
  });
};
