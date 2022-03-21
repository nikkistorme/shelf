import bookSearchService from "../../services/bookSearchService";

const searchBooks = async ({ commit }, searchTerm) => {
  try {
    const results = await bookSearchService.searchBooks(searchTerm);
    return results;
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

export default {
  searchBooks,
};
