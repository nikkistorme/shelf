export const sortShelfByMethod = (a, b, shelf) => {
  const method = shelf.sort?.method;
  const descending = shelf.sort?.descending;

  if (method === "date_added_to_library") {
    return sortByDateAdded(a, b, descending);
  } else if (method === "date-started") {
    return sortByDateStarted(a, b, descending);
  } else if (method === "date_added_to_shelf") {
    return sortByDateAddedToShelf(a, b, shelf);
  } else if (method === "percent_complete") {
    return sortByPercentComplete(a, b, descending);
  } else if (method === "last_updated_progress") {
    return sortByLastUpdatedProgress(a, b, descending);
  } else if (method === "title") {
    return sortByTitle(a, b, descending);
  } else {
    return 0;
  }
};

const sortByDateAdded = (a, b, descending) => {
  let aDateAdded = a.inserted_at;
  let bDateAdded = b.inserted_at;

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
  } else if (shelf.finishedShelf) {
    aDateAddedToShelf = a.changes
      ?.reverse()
      .find((c) => c.action === "finishReading")?.payload.timestamp;
    bDateAddedToShelf = b.changes
      ?.reverse()
      .find((c) => c.action === "finishReading")?.payload.timestamp;
  } else if (shelf.allBooksShelf) {
    aDateAddedToShelf = a.changes?.find((c) => c.action === "addBook")?.payload
      .timestamp;
    bDateAddedToShelf = b.changes?.find((c) => c.action === "addBook")?.payload
      .timestamp;
  } else {
    const aRelevantChanges = a.changes?.filter(
      (c) => c.payload?.newValue === shelf.id
    );
    aDateAddedToShelf = aRelevantChanges[0]?.payload.timestamp;
    const bRelevantChanges = b.changes?.filter(
      (c) => c.payload?.newValue === shelf.id
    );
    bDateAddedToShelf = bRelevantChanges[0]?.payload.timestamp;
  }

  if (!aDateAddedToShelf) {
    aDateAddedToShelf = 0;
  }
  if (!bDateAddedToShelf) {
    bDateAddedToShelf = 0;
  }
  // if (a.title === "The Red Threads of Fortune") {
  //   console.log("🚀 ~ aDateAddedToShelf", aDateAddedToShelf);
  //   console.log("🚀 ~ bDateAddedToShelf", bDateAddedToShelf);
  // }
  if (shelf.sort?.descending) {
    return aDateAddedToShelf > bDateAddedToShelf ? -1 : 1;
  } else {
    return aDateAddedToShelf < bDateAddedToShelf ? -1 : 1;
  }
};

const sortByPercentComplete = (a, b, descending) => {
  let aPercentComplete = 0;
  let bPercentComplete = 0;

  if (!a.readthroughs?.length > 0) {
    aPercentComplete = a.readPages / a.totalPages;
  }
  if (!b.readthroughs?.length > 0) {
    bPercentComplete = b.readPages / b.totalPages;
  }

  if (descending) {
    return aPercentComplete > bPercentComplete ? -1 : 1;
  } else {
    return aPercentComplete < bPercentComplete ? -1 : 1;
  }
};

const sortByLastUpdatedProgress = (a, b, descending) => {
  let aLastUpdated = null;
  let bLastUpdated = null;

  if (a.changes?.length) {
    aLastUpdated = a.changes
      .sort((a, b) => {
        return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
      })
      .find((c) => c.action === "updatePage")?.payload.timestamp;
  }
  if (b.changes?.length) {
    bLastUpdated = b.changes
      .sort((a, b) => {
        return a.payload.timestamp > b.payload.timestamp ? -1 : 1;
      })
      .find((c) => c.action === "updatePage")?.payload.timestamp;
  }

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

export const sortByTitle = (a, b, descending) => {
  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();
  if (descending) {
    return aTitle > bTitle ? -1 : 1;
  } else {
    return aTitle < bTitle ? -1 : 1;
  }
};

export const filterBooksBySearchTerm = (books, searchTerm) => {
  if (searchTerm) {
    books = books.filter((book) => {
      let searchMatchTitle = false;
      let searchMatchAuthor = false;
      if (book.title) {
        searchMatchTitle = book.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        console.log(book);
      }
      if (book.author) {
        searchMatchAuthor = book.author
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return searchMatchTitle || searchMatchAuthor;
    });
  }
  return books;
};
