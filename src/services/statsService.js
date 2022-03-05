const dateIsToday = (timestamp) => {
  const today = new Date();
  const changeDate = new Date(timestamp);
  return (
    today.getDate() === changeDate.getDate() &&
    today.getMonth() === changeDate.getMonth() &&
    today.getFullYear() === changeDate.getFullYear()
  );
};

const getPagesRemaining = (book) => {
  return book.totalPages - book.readPages;
};

const getProgressUpdates = (changes) => {
  return changes.filter((change) => change.action === "updatePage");
};

const changesWithDuration = (changes) => {
  if (changes?.length) {
    return getProgressUpdates(changes).filter(
      (change) => change.action === "updatePage" && change.payload.duration > 0
    );
  } else {
    return [];
  }
};

const groupUpdatesByDate = (updates) => {
  let groupedUpdates = {};
  updates.forEach((update) => {
    const date = new Date(update.payload.timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const dateString = `${month}/${day}/${year}`;
    if (groupedUpdates[dateString]) {
      groupedUpdates[dateString].push(update);
    } else {
      groupedUpdates[dateString] = [update];
    }
  });
  Object.keys(groupedUpdates).forEach((date) => {
    groupedUpdates[date].sort(
      (a, b) => b.payload.timestamp - a.payload.timestamp
    );
  });
  return groupedUpdates;
};

const pagesReadToday = (books) => {
  let pages = 0;
  books.forEach((book) => {
    if (book.changes?.length) {
      const todayChanges = book.changes.filter(
        (change) =>
          dateIsToday(change.payload.timestamp) &&
          change.action === "updatePage"
      );
      todayChanges.forEach((change) => {
        pages += change.payload.newValue - change.payload.oldValue;
      });
    }
  });
  return pages;
};

const timeRemaining = (book) => {
  const pagesRemaining = getPagesRemaining(book);
  let pagesPerMinData = [];
  changesWithDuration(book.changes).forEach((change) => {
    const pagesRead = change.payload.newValue - change.payload.oldValue;
    pagesPerMinData.push(pagesRead / change.payload.duration);
  });
  if (pagesPerMinData.length > 0) {
    const averageDuration =
      pagesPerMinData.reduce((a, b) => a + b) / pagesPerMinData.length;
    const minPerPage = Math.round((1 / averageDuration) * 10) / 10;
    const timeRemaining = pagesRemaining / averageDuration;
    const hoursRemaining = Math.floor(timeRemaining / 60);
    const minutesRemaining = Math.round(timeRemaining - hoursRemaining * 60);
    return { timeRemaining, hoursRemaining, minutesRemaining, minPerPage };
  } else return "";
};

const overallPace = (book) => {
  const pagesRemaining = getPagesRemaining(book);
  const progressUpdates = getProgressUpdates(book.changes);
  const groupedUpdates = groupUpdatesByDate(progressUpdates);
  let dayPageCounts = [];
  let dayPageInfo = [];
  Object.keys(groupedUpdates).forEach((date, i) => {
    let highestPage = 0;
    let lowestPage = 0;
    if (dayPageInfo.length) {
      highestPage = dayPageInfo[i - 1].lowestPage;
    } else {
      highestPage = groupedUpdates[date][0].payload.newValue;
    }
    lowestPage =
      groupedUpdates[date][groupedUpdates[date].length - 1].payload.oldValue;
    dayPageCounts.push(highestPage - lowestPage);
    dayPageInfo.push({
      date,
      pageCount: highestPage - lowestPage,
      lowestPage: lowestPage,
    });
  });
  let averagePagesPerDay = 0;
  if (dayPageCounts.length > 0) {
    averagePagesPerDay = Math.round(
      dayPageCounts.reduce((a, b) => a + b) / dayPageCounts.length
    );
  }
  const remainingDays = Math.round(pagesRemaining / averagePagesPerDay);
  return {
    averagePagesPerDay: averagePagesPerDay,
    remainingDays: remainingDays,
  };
};

export default {
  changesWithDuration,
  groupUpdatesByDate,
  pagesReadToday,
  timeRemaining,
  overallPace,
};
