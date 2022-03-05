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
};

const getDetailedBook = async ({ getters, commit }, id) => {
  const detailedBook = getters.getBookById(id);
  commit("setDetailedBook", detailedBook);
};

export default {
  getBooks,
  updatePage,
  getDetailedBook,
};
