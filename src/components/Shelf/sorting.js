let sortOptions = {};

sortOptions.selectedSortMethod = (a, b, shelf) => {
  const method = shelf.sort?.method;
  const descending = shelf.sort?.descending;
  if (method === "dateAdded") {
    return sortOptions.sortByDateAdded(a, b, descending);
  } else if (method === "dateStarted") {
    return sortOptions.sortByDateStarted(a, b, descending);
  } else if (method === "dateAddedToShelf") {
    return sortOptions.sortByDateAddedToShelf(a, b, shelf);
  } else if (method === "percentComplete") {
    return sortOptions.sortByPercentComplete(a, b, descending);
  } else if (method === "lastUpdatedProgress") {
    return sortOptions.sortByLastUpdatedProgress(a, b, descending);
  } else {
    return 0;
  }
};

sortOptions.sortByDateAdded = (a, b, descending) => {
  // eslint-disable-next-line prettier/prettier
  let aDateAdded = a.changes?.find(c => c.action === "addBook")?.payload.timestamp;
  // eslint-disable-next-line prettier/prettier
  let bDateAdded = b.changes?.find(c => c.action === "addBook")?.payload.timestamp;
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

sortOptions.sortByDateStarted = (a, b, descending) => {
  // eslint-disable-next-line prettier/prettier
  let aDateStarted = a.changes?.find(c => c.action === "startReading")?.payload.timestamp;
  // eslint-disable-next-line prettier/prettier
  let bDateStarted = b.changes?.find(c => c.action === "startReading")?.payload.timestamp;
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

sortOptions.sortByDateStartedAscending = (a, b) => {
  // eslint-disable-next-line prettier/prettier
  let aDateStarted = a.changes?.find(c => c.action === "startReading")?.payload.timestamp;
  // eslint-disable-next-line prettier/prettier
  let bDateStarted = b.changes?.find(c => c.action === "startReading")?.payload.timestamp;
  if (!aDateStarted) {
    aDateStarted = 0;
  }
  if (!bDateStarted) {
    bDateStarted = 0;
  }
  return aDateStarted > bDateStarted ? 1 : -1;
};

sortOptions.sortByDateAddedToShelf = (a, b, shelf) => {
  let aDateAddedToShelf = a.changes?.find(c => {
    c.payload.newValue.includes(shelf.id) &&
      !c.payload.oldValue.includes(shelf.id);
  })?.payload.timestamp;
  let bDateAddedToShelf = b.changes?.find(c => {
    c.payload.newValue.includes(shelf.id) &&
      !c.payload.oldValue.includes(shelf.id);
  })?.payload.timestamp;
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

sortOptions.sortByPercentComplete = (a, b, descending) => {
  const aPercentComplete = a.readPages / a.totalPages;
  const bPercentComplete = b.readPages / b.totalPages;
  if (descending) {
    return aPercentComplete > bPercentComplete ? -1 : 1;
  } else {
    return aPercentComplete < bPercentComplete ? -1 : 1;
  }
};

sortOptions.sortByLastUpdatedProgress = (a, b, descending) => {
  let aLastUpdated = a.changes
    .sort((a, b) => {
      return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
    })
    .find(c => c.action === "updatePage")?.payload.timestamp;
  let bLastUpdated = b.changes
    .sort((a, b) => {
      return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
    })
    .find(c => c.action === "updatePage")?.payload.timestamp;
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

export default sortOptions;
