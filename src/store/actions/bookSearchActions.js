/* eslint-disable no-unused-vars */
import bookSearchService from "../../services/bookSearchService";

const searchBooks = async ({ commit }, searchTerm) => {
  try {
    const results = await bookSearchService.searchBooks(searchTerm);
    return results;
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

const getBookToAdd = async ({ commit }, book) => {
  let coreBook = null;
  // try {
  //   if (book.googleId) {
  //     console.log(`${book.title} core exists`);
  //     coreBook = await bookSearchService.getCoreBook(book.googleId);
  //   } else {
  //     console.log(`Creating ${book.title} core`);
  //     coreBook = bookSearchService.newCoreBookObject(book);
  //     await bookSearchService.addCoreBook(coreBook);
  //   }
  // } catch (error) {
  //   console.log("🚀 ~ error", error);
  //   throw error;
  // }
  commit("setBookToAdd", book);
};

export default {
  searchBooks,
  getBookToAdd,
};
