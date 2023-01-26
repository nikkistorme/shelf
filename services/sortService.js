export const sortShelfByMethod = (a, b, shelf) => {
  const method = shelf.sort?.method;
  const descending = shelf.sort?.descending;

  switch (method) {
    case "date_added_to_library":
      return sortByDateAdded(a, b, descending);
    case "date-started":
      return sortByDateStarted(a, b, descending);
    case "date_added_to_shelf":
      return sortByDateAddedToShelf(a, b, shelf);
    case "percent_complete":
      return sortByPercentComplete(a, b, descending);
    case "last_updated_progress":
      return sortByLastUpdatedProgress(a, b, descending);
    case "title":
      return sortByTitle(a, b, descending);
    case "page_count":
      return sortByPageCount(a, b, descending);
    case "author":
      return sortByAuthor(a, b, descending);
    case "date_finished":
      return sortByDateFinished(a, b, descending);
    default:
      return 0;
  }
};

const sortByDateAdded = (a, b, descending) => {
  let aDateAdded = a.inserted_at;
  let bDateAdded = b.inserted_at;

  if (!aDateAdded) aDateAdded = 0;
  if (!bDateAdded) bDateAdded = 0;

  if (descending) return aDateAdded > bDateAdded ? -1 : 1;
  else return aDateAdded < bDateAdded ? -1 : 1;
};

const sortByDateStarted = (a, b, descending) => {
  let aDateStarted = a.changes?.find((c) => c.action === "startReading")
    ?.payload.timestamp;
  let bDateStarted = b.changes?.find((c) => c.action === "startReading")
    ?.payload.timestamp;

  if (!aDateStarted) aDateStarted = 0;
  if (!bDateStarted) bDateStarted = 0;

  if (descending) return aDateStarted > bDateStarted ? -1 : 1;
  else return aDateStarted < bDateStarted ? -1 : 1;
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

  if (!aDateAddedToShelf) aDateAddedToShelf = 0;
  if (!bDateAddedToShelf) bDateAddedToShelf = 0;

  if (shelf.sort?.descending)
    return aDateAddedToShelf > bDateAddedToShelf ? -1 : 1;
  else return aDateAddedToShelf < bDateAddedToShelf ? -1 : 1;
};

const sortByPercentComplete = (a, b, descending) => {
  let aPercentComplete = 0;
  let bPercentComplete = 0;

  if (!a.readthroughs?.length > 0) {
    aPercentComplete = a.current_page / a.total_pages;
  }
  if (!b.readthroughs?.length > 0) {
    bPercentComplete = b.current_page / b.total_pages;
  }

  if (descending) return aPercentComplete > bPercentComplete ? -1 : 1;
  else return aPercentComplete < bPercentComplete ? -1 : 1;
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

  if (!aLastUpdated) aLastUpdated = 0;
  if (!bLastUpdated) bLastUpdated = 0;

  if (descending) return aLastUpdated > bLastUpdated ? -1 : 1;
  else return aLastUpdated < bLastUpdated ? -1 : 1;
};

export const sortByTitle = (a, b, descending) => {
  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();
  if (descending) return aTitle > bTitle ? -1 : 1;
  else return aTitle < bTitle ? -1 : 1;
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

export const sortByPageCount = (a, b, descending) => {
  if (descending) return a.total_pages > b.total_pages ? -1 : 1;
  else return a.total_pages < b.total_pages ? -1 : 1;
};

export const sortByAuthor = (a, b, descending) => {
  const aAuthor = a.author.toLowerCase();
  const bAuthor = b.author.toLowerCase();
  if (descending) return aAuthor > bAuthor ? -1 : 1;
  else return aAuthor < bAuthor ? -1 : 1;
};

export const sortByDateFinished = (a, b, descending) => {
  let aReadthroughs = a.readthroughs.sort((a, b) => (a.end > b.end ? -1 : 1));
  let bReadthroughs = b.readthroughs.sort((a, b) => (a.end > b.end ? -1 : 1));

  let aDateFinished = aReadthroughs[0]?.end;
  let bDateFinished = bReadthroughs[0]?.end;

  if (!aDateFinished) aDateFinished = a.status === "finished" ? "0" : "";
  if (!bDateFinished) bDateFinished = b.status === "finished" ? "0" : "";

  if (descending) return aDateFinished > bDateFinished ? -1 : 1;
  else return aDateFinished < bDateFinished ? -1 : 1;
};
