export const updateSchema = () => {
  return {
    field: "",
    old_value: null,
    new_value: null,
    new_value_soft: null,
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

const getNewUpdate = (action: string, field: string, book: UserBook, misc: MiscUpdateParam | null = null) => {
  let newUpdate: Update = updateSchema();
  newUpdate.field = field;
  switch (field) {
    case "in_progress":
      newUpdate.old_value = book.status;
      if (action === "startReadingBook") {
        newUpdate.new_value = true;
      } else if (action === "finishReadingBook") {
        newUpdate.new_value = false;
      }
      break;
    case "current_page":
      newUpdate.old_value = book.current_page ? book.current_page : 0;
      if (action === "startReadingBook") {
        newUpdate.new_value = 0;
      } else if (["updateProgress", "finishReadingBook"].includes(action) && misc?.endAt) {
        newUpdate.new_value = misc.endAt;
      }
      break;
    case "duration":
      if (misc?.duration) newUpdate.new_value = misc.duration;
      break;
    case "goal":
      if (!misc?.oldGoal && !misc?.targetPage && !misc?.goalDate) break;
      newUpdate.old_value = misc.oldGoal;
      if (action === "setGoal") {
        newUpdate.new_value = {
          target_page: misc.targetPage,
          goal_date: misc.goalDate,
          start_date: new Date().toISOString(),
        } as Goal;
      } else if (action === "removeGoal") {
        newUpdate.new_value = null;
      }
      break;
    case "finished":
      newUpdate.old_value = book.status;
      newUpdate.new_value = "finished";
      break;
    case "cover":
      if (!misc?.cover) break;
      newUpdate.old_value = book.cover;
      newUpdate.new_value = misc.cover;
      break;
    case "total_pages":
      if (!misc?.total_pages) break;
      newUpdate.old_value = book.total_pages;
      newUpdate.new_value = misc.total_pages;
      break;
    default:
      break;
  }
  return newUpdate;
};

export const newChange = (action: string, book: UserBook | BookEdition, misc: MiscUpdateParam | null = null) => {
  let newChange: Change = changeSchema();
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
      if (misc?.duration)
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
      if (misc?.duration)
        newChange.updates.push(
          getNewUpdate("finishReadingBook", "duration", book, misc)
        );
      if (misc?.oldGoal)
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

export const newChangeFromForm = (action: string, book: UserBook) => {
  let newChange = changeSchema();
  newChange.action = action;
  newChange.created = new Date().toISOString();
  switch (action) {
    default:
      break;
  }
  return newChange;
};

export const sortChanges = (changes: Change[]) => {
  return changes.sort((a, b) => {
    return a.created > b.created ? -1 : 1;
  });
};
