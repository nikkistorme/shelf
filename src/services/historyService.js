import { getFormattedDate, getProgressUpdates } from "./statsService.js";

export const historyMessageFromUpdate = (detailedBook, update) => {
  let duration = "";
  switch (update.action) {
    case "addBook":
      return "Added to library";
    case "startReading":
      return `Started reading`;
    case "updatePage":
      if (update.payload.duration > 0) {
        duration = ` in ${update.payload.duration}m`;
      }
      return `Page ${update.payload.oldValue}-${update.payload.newValue}${duration}`;
    case "setGoal":
      return `Set goal to ${
        update.fields.goal.targetPage === detailedBook.totalPages
          ? "finish"
          : `page ${update.fields.goal.targetPage}`
      } by ${getFormattedDate(update.fields.goal.goalDate)}`;
    case "finishReading":
      return `Finished reading`;
    case "addToShelf":
      return `Added to '${update.fields.shelfName}'`;
    case "removeFromShelf":
      return `Removed from '${update.fields.shelfName}'`;
    case "updateField":
      if (update.fields?.fieldName) {
        switch (update.fields.fieldName) {
          case "totalPages":
            return `Updated total pages to ${update.payload.newValue}`;
          default:
            return `Updated ${update.fields.fieldName} to ${update.payload.newValue}`;
        }
      } else {
        return "Updated info";
      }
    default:
      console.log("🚀 ~ update.action", update.action);
      return "Updated";
  }
};

const pagesReadInGroupedUpdate = (groupedUpdates, change) => {
  let targetDayUpdates = groupedUpdates[change.label];
  targetDayUpdates = getProgressUpdates(targetDayUpdates);
  if (targetDayUpdates?.length > 0) {
    const lastPage = targetDayUpdates[0].payload.newValue;
    const earliestPage =
      targetDayUpdates[targetDayUpdates.length - 1].payload.oldValue;
    return lastPage - earliestPage;
  } else return 0;
};

export default {
  historyMessageFromUpdate,
  pagesReadInGroupedUpdate,
};
