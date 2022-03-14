import bookService from "../../services/bookService.js";
import changeService from "../../services/changeService.js";

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
  const detailedBook = getters.getBookById(id);
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
    bookAndChange.book.finishedDate = bookAndChange.change.fields.finishedDate;
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

export default {
  getBooks,
  updatePage,
  getDetailedBook,
  setGoal,
  finishReading,
  addBookToShelf,
  removeBookFromShelf,
};
