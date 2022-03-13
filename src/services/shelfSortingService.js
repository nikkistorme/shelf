export const getShelfSortOptions = (shelf) => {
  const inProgressShelf = shelf.inProgressShelf;
  return [
    {
      value: "date-added-to-library",
      label: "Date added",
    },
    {
      value: "percent-complete",
      label: "Progress",
    },
    {
      value: "last-updated-progress",
      label: "Last updated progress",
    },
    {
      value: "date-added-to-shelf",
      label: inProgressShelf ? "Date started" : "Date added to shelf",
    },
  ];
};

export const sortShelfByMethod = (a, b, shelf) => {
  const method = shelf.sort?.method;
  const descending = shelf.sort?.descending;

  if (method === "date-added-to-library") {
    return sortByDateAdded(a, b, descending);
  } else if (method === "date-started") {
    return sortByDateStarted(a, b, descending);
  } else if (method === "date-added-to-shelf") {
    return sortByDateAddedToShelf(a, b, shelf);
  } else if (method === "percent-complete") {
    return sortByPercentComplete(a, b, descending);
  } else if (method === "last-updated-progress") {
    return sortByLastUpdatedProgress(a, b, descending);
  } else {
    return 0;
  }
};

const sortByDateAdded = (a, b, descending) => {
  let aDateAdded = a.changes?.find((c) => c.action === "addBook")?.payload
    .timestamp;
  let bDateAdded = b.changes?.find((c) => c.action === "addBook")?.payload
    .timestamp;

  if (!aDateAdded) {
    aDateAdded = 0;
  }
  if (!bDateAdded) {
    bDateAdded = 0;
  }
  if (descending) {
    return aDateAdded > bDateAdded ? -1 : 1;
  } else {
    return aDateAdded < bDateAdded ? -1 : 1;
  }
};

const sortByDateStarted = (a, b, descending) => {
  let aDateStarted = a.changes?.find((c) => c.action === "startReading")
    ?.payload.timestamp;
  let bDateStarted = b.changes?.find((c) => c.action === "startReading")
    ?.payload.timestamp;

  if (!aDateStarted) {
    aDateStarted = 0;
  }
  if (!bDateStarted) {
    bDateStarted = 0;
  }
  if (descending) {
    return aDateStarted > bDateStarted ? -1 : 1;
  } else {
    return aDateStarted < bDateStarted ? -1 : 1;
  }
};

const sortByDateAddedToShelf = (a, b, shelf) => {
  let aDateAddedToShelf = null;
  let bDateAddedToShelf = null;

  if (shelf.inProgressShelf) {
    aDateAddedToShelf = a.changes?.find((c) => c.action === "startReading")
      ?.payload.timestamp;
    bDateAddedToShelf = b.changes?.find((c) => c.action === "startReading")
      ?.payload.timestamp;
  } else {
    aDateAddedToShelf = a.changes?.find((c) => {
      c.payload.newValue?.length &&
        c.payload.newValue.includes(shelf.id) &&
        !c.payload.oldValue.includes(shelf.id);
    })?.payload.timestamp;
    bDateAddedToShelf = b.changes?.find((c) => {
      c.payload.newValue?.length &&
        c.payload.newValue.includes(shelf.id) &&
        !c.payload.oldValue.includes(shelf.id);
    })?.payload.timestamp;
  }

  if (!aDateAddedToShelf) {
    aDateAddedToShelf = 0;
  }
  if (!bDateAddedToShelf) {
    bDateAddedToShelf = 0;
  }
  if (shelf.sort?.descending) {
    return aDateAddedToShelf > bDateAddedToShelf ? -1 : 1;
  } else {
    return aDateAddedToShelf < bDateAddedToShelf ? -1 : 1;
  }
};

const sortByPercentComplete = (a, b, descending) => {
  const aPercentComplete = a.readPages / a.totalPages;
  const bPercentComplete = b.readPages / b.totalPages;

  if (descending) {
    return aPercentComplete > bPercentComplete ? -1 : 1;
  } else {
    return aPercentComplete < bPercentComplete ? -1 : 1;
  }
};

const sortByLastUpdatedProgress = (a, b, descending) => {
  let aLastUpdated = a.changes
    .sort((a, b) => {
      return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
    })
    .find((c) => c.action === "updatePage")?.payload.timestamp;
  let bLastUpdated = b.changes
    .sort((a, b) => {
      return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
    })
    .find((c) => c.action === "updatePage")?.payload.timestamp;

  if (!aLastUpdated) {
    aLastUpdated = 0;
  }
  if (!bLastUpdated) {
    bLastUpdated = 0;
  }
  if (descending) {
    return aLastUpdated > bLastUpdated ? -1 : 1;
  } else {
    return aLastUpdated < bLastUpdated ? -1 : 1;
  }
};
