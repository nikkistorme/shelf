import fb from "../firebase";

const formatError = (error) => {
  console.log("🚀 ~ error", error);
  switch (error.code) {
    // case "auth/requires-recent-login":
    //   return new Error(
    //     "Your session is too old. Sign in again to update your password."
    //   );
    default:
      return error;
  }
};

const getBooks = async () => {
  let allBooks = [];
  try {
    const querySnapshot = await fb.booksCollection
      .where("user", "==", fb.auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let book = doc.data();
      allBooks.push(book);
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
  return allBooks;
};

const updatePage = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      readPages: book.readPages,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const setGoal = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      goal: book.goal,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const finishReading = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      finishedDate: book.finishedDate,
      goal: book.goal,
      readPages: book.readPages,
      inProgress: book.inProgress,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const updateBookShelves = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      shelves: book.shelves,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

export default {
  getBooks,
  updatePage,
  setGoal,
  finishReading,
  updateBookShelves,
};
