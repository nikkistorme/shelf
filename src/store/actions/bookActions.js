import bookService from "../../services/bookService.js";
import changeService from "../../services/changeService.js";

const addBookToLibrary = async ({ commit, state }, book) => {
  commit("setDetailedBookLoading", true);
  try {
    let newBook = bookService.newBookObject(book, state.user.uid);
    console.log("🚀 ~ newBook", newBook);
    await bookService.addBook(newBook);
    commit("addBook", newBook);
    commit("setDetailedBookLoading", false);
    return newBook;
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
};

const getBooks = async ({ commit }) => {
  try {
    const books = await bookService.getBooks();
    commit("setBooks", books);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDetailedBook = async ({ getters, commit }, id) => {
  const detailedBook = await bookService.getBook(id);
  try {
    const shelves = getters.shelves;
    let staleShelfIds = [];
    detailedBook.shelves.forEach((shelfId) => {
      const shelfInStore = shelves.find((s) => s.id === shelfId);
      if (!shelfInStore) {
        staleShelfIds.push(shelfId);
      }
    });
    if (staleShelfIds.length > 0) {
      console.log("🚀 ~ staleShelfIds", staleShelfIds);
      detailedBook.shelves = detailedBook.shelves.filter((shelfId) => {
        return !staleShelfIds.includes(shelfId);
      });
      await bookService.updateBookShelves(detailedBook);
    }
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", detailedBook);
};

const updatePage = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book.readPages = bookAndChange.change.payload.newValue;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.updatePage(bookAndChange.book);
  } catch (error) {
    console.log(error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
  commit("setUpdateProgressVisible", false);
};

const setGoal = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book.goal = bookAndChange.change.fields.goal;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.setGoal(bookAndChange.book);
  } catch (error) {
    console.log(error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
};

const finishReading = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book.finished = true;
    bookAndChange.book.goal = bookAndChange.change.fields.goal;
    bookAndChange.book.readPages = bookAndChange.change.fields.readPages;
    bookAndChange.book.inProgress = bookAndChange.change.fields.inProgress;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.finishReading(bookAndChange.book);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
  commit("setUpdateProgressVisible", false);
};

const addBookToShelf = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book.shelves.push(bookAndChange.change.payload.newValue);
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.updateBookShelves(bookAndChange.book);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
};

const removeBookFromShelf = async ({ commit }, bookAndChange) => {
  try {
    const newShelves = bookAndChange.book.shelves.filter((shelf) => {
      return shelf !== bookAndChange.change.payload.oldValue;
    });
    bookAndChange.book.shelves = newShelves;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.updateBookShelves(bookAndChange.book);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
};

const updateBookField = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book[bookAndChange.field] =
      bookAndChange.change.payload.newValue;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.updateBookField(bookAndChange.book, bookAndChange.field);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", bookAndChange.book);
};

const startReadingBook = async ({ commit }, bookAndChange) => {
  try {
    bookAndChange.book.inProgress = true;
    bookAndChange.book.readPages = 0;
    bookAndChange.book = changeService.addChangeToBook(
      bookAndChange.book,
      bookAndChange.change
    );
    await bookService.startReadingBook(bookAndChange.book);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  console.log("success");
  commit("setDetailedBook", bookAndChange.book);
};

// const sanitizeBook = async ({ commit, state }, book) => {
//   try {
//     book.shelves.forEach((shelfId) => {
//       const shelfIsInStore = state.shelves.find((s) => s.id === shelfId);
//       if (!shelfIsInStore) {

//       }
//     })
//   } catch (error) {
//     console.log("🚀 ~ error", error);
//     throw error;
//   }
// };

const deleteBook = async ({ commit }, book) => {
  try {
    await bookService.deleteBook(book);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setDetailedBook", {});
  commit("deleteBook", book);
};

export default {
  addBookToLibrary,
  getBooks,
  updatePage,
  getDetailedBook,
  setGoal,
  finishReading,
  addBookToShelf,
  removeBookFromShelf,
  updateBookField,
  startReadingBook,
  // sanitizeBook,
  deleteBook,
};
