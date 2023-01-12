import { getBooksUpdatedThisWeek } from "./bookService";

const getProgressChanges = (changes: [ { action: '', updates: [] } ]) => {
  return changes.filter((change) => ["updateProgress", "finishReadingBook"].includes(change.action));
};

const getChangesWithDuration = (changes: [ { action: '', updates: [] } ]) => {
  if (changes?.length) {
    const progressChanges = getProgressChanges(changes);
    const durationChanges = progressChanges.filter((change) => {
      const durationUpdate = change?.updates?.find((update: any) => update.field === "duration");
      return durationUpdate;
    })
    return durationChanges;
  } else {
    return [];
  }
};

export const dateIsToday = (date_in_question: string | number | Date) => {
  const today = new Date();
  const changeDate = new Date(date_in_question);
  return (
    today.getDate() === changeDate.getDate() &&
    today.getMonth() === changeDate.getMonth() &&
    today.getFullYear() === changeDate.getFullYear()
  );
};

export const dateIsThisWeek = (date_in_question: string | number | Date) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateInQuestionObject = new Date(date_in_question);
  return dateInQuestionObject.valueOf() > sevenDaysAgo.valueOf();
};

export const pagesReadToday = (books: any[]) => {
  let pages = 0;
  books.forEach((book) => {
    if (book.changes?.length) {
      const todayChanges = book.changes.filter(
        (change: { created: any; action: string; }) =>
          dateIsToday(change.created) &&
          (change.action === "updateProgress" || change.action === "finishReadingBook")
      );
      todayChanges.forEach((change: { updates: any[]; }) => {
        const pageUpdate = change.updates.find((update) => update.field === 'current_page');
        pages += pageUpdate.newValue - pageUpdate.oldValue;
      });
    }
  });
  return pages;
}

export const getNewMinutesPerPage = (changes: any) => {
  let pagesPerMinData: number[] = [];
  const changesWithDuration = getChangesWithDuration(changes);
  changesWithDuration.forEach((change) => {
    const currentPageUpdate = change.updates.find((update: any) => update.field === 'current_page');
    const durationUpdate = change.updates.find((update: any) => update.field === 'duration');
    const pagesRead = currentPageUpdate.newValue - currentPageUpdate.oldValue;
    if (pagesRead > 0 && durationUpdate.newValue > 0) {
      pagesPerMinData.push(pagesRead / durationUpdate.newValue);
    }
  });
  if (pagesPerMinData?.length > 0) {
    const averageDuration =
      pagesPerMinData.reduce((a, b) => a + b) / pagesPerMinData.length;
    const minPerPage = Math.round((1 / averageDuration) * 10) / 10;
    return minPerPage;
  } else return null;
}

export const getGoalPace = (book: { goal: { targetPage: number; goalDate: string | number | Date; }; current_page: number; minutes_per_page: any; }) => {
  const pagesRemaining = book.goal.targetPage - book.current_page;
  const today = new Date();
  const goalDate = new Date(book.goal.goalDate);
  const differenceInTime = goalDate.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const pace = Math.ceil(pagesRemaining / differenceInDays);
  const minPerPage = book.minutes_per_page;
  const minsPerDay = Math.ceil(minPerPage * pace);
  const hoursPerDay = Math.floor(minsPerDay / 60);
  const leftoverMinsPerDay = minsPerDay - hoursPerDay * 60;
  return {
    pagesPerDay: pace,
    minsPerDay: minsPerDay,
    hoursPerDay: hoursPerDay,
    leftoverMinsPerDay: leftoverMinsPerDay,
  };
}

export const getPagesThisWeek = async () => {
  let pagesThisWeek = 0
  let pagesToday = 0;
  try {
    const booksUpdatedThisWeek = await getBooksUpdatedThisWeek();
    booksUpdatedThisWeek?.forEach((book: any) => {
      book.changes.forEach((c: { action: string, created: string, updates: [] }) => {
        if (!["updateProgress", "finishReadingBook"].includes(c.action)) return;
        if (!dateIsThisWeek(c.created)) return;
        const pageUpdate = c.updates.find((update: { field: string }) => update.field === 'current_page') || {};
        if (!pageUpdate) return;
        console.log("🚀 ~ pageUpdate", pageUpdate);
        pagesThisWeek += pageUpdate.newValue - pageUpdate.oldValue;
        if (dateIsToday(c.created)) pagesToday += pageUpdate.newValue - pageUpdate.oldValue;
      })
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
  return [pagesToday, pagesThisWeek];
};
