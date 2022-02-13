let sortOptions = {};

sortOptions.selectedSortMethod = (a, b, shelf) => {
  const method = shelf.sort?.method;
  const descending = shelf.sort?.descending;
  if (method === "dateAdded" && descending) {
    return sortOptions.sortByDateAddedDescending(a, b);
  } else if (method === "dateAdded" && !descending) {
    return sortOptions.sortByDateAddedAscending(a, b);
  } else if (method === "dateStarted" && descending) {
    return sortOptions.sortByDateStartedDescending(a, b);
  } else if (method === "dateStarted" && !descending) {
    return sortOptions.sortByDateStartedAscending(a, b);
  } else if (method === "dateAddedToShelf" && descending) {
    return sortOptions.sortByDateAddedToShelfDescending(a, b, shelf.id);
  } else if (method === "dateAddedToShelf" && !descending) {
    return sortOptions.sortByDateAddedToShelfAscending(a, b, shelf.id);
  } else {
    return 0;
  }
};

sortOptions.sortByDateAddedDescending = (a, b) => {
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
  return aDateAdded > bDateAdded ? -1 : 1;
};

sortOptions.sortByDateAddedAscending = (a, b) => {
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
  return aDateAdded > bDateAdded ? 1 : -1;
};

sortOptions.sortByDateStartedDescending = (a, b) => {
  // eslint-disable-next-line prettier/prettier
  let aDateStarted = a.changes?.find(c => c.action === "startReading")?.payload.timestamp;
  console.log("🚀 ~ file: sorting.js ~ line 34 ~ aDateStarted", aDateStarted);
  // eslint-disable-next-line prettier/prettier
  let bDateStarted = b.changes?.find(c => c.action === "startReading")?.payload.timestamp;
  console.log("🚀 ~ file: sorting.js ~ line 37 ~ bDateStarted", bDateStarted);
  if (!aDateStarted) {
    aDateStarted = 0;
  }
  if (!bDateStarted) {
    bDateStarted = 0;
  }
  return aDateStarted > bDateStarted ? -1 : 1;
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

sortOptions.sortByDateAddedToShelfDescending = (a, b, shelfId) => {
  let aDateAddedToShelf = a.changes?.find(c => {
    c.payload.newValue.includes(shelfId) &&
      !c.payload.oldValue.includes(shelfId);
  })?.payload.timestamp;
  let bDateAddedToShelf = b.changes?.find(c => {
    c.payload.newValue.includes(shelfId) &&
      !c.payload.oldValue.includes(shelfId);
  })?.payload.timestamp;
  if (!aDateAddedToShelf) {
    aDateAddedToShelf = 0;
  }
  if (!bDateAddedToShelf) {
    bDateAddedToShelf = 0;
  }
  return aDateAddedToShelf > bDateAddedToShelf ? -1 : 1;
};

sortOptions.sortByDateAddedToShelfAscending = (a, b, shelfId) => {
  let aDateAddedToShelf = a.changes?.find(c => {
    c.payload.newValue.includes(shelfId) &&
      !c.payload.newValue.includes(shelfId);
  })?.payload.timestamp;
  let bDateAddedToShelf = b.changes?.find(c => {
    c.payload.newValue.includes(shelfId) &&
      !c.payload.newValue.includes(shelfId);
  })?.payload.timestamp;
  if (!aDateAddedToShelf) {
    aDateAddedToShelf = 0;
  }
  if (!bDateAddedToShelf) {
    bDateAddedToShelf = 0;
  }
  return aDateAddedToShelf > bDateAddedToShelf ? 1 : -1;
};

export default sortOptions;
