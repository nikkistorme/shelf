const setUser = (state, user) => {
  state.user = user;
};

const setUserLoading = (state, loading) => {
  state.loading.user = loading;
};

const setUserProfile = (state, profile) => {
  state.userProfile = profile;
};

const setBooks = (state, books) => {
  state.books = books;
};

const setDetailedBook = (state, book) => {
  state.detailedBook = book;
};

const addShelf = (state, shelf) => {
  state.shelves.push(shelf);
};

const setShelves = (state, shelves) => {
  state.shelves = shelves;
};

const setShelf = (state, shelf) => {
  state.shelves = state.shelves.filter((s) => s.id !== shelf.id);
  state.shelves.push(shelf);
};

const setActiveShelf = (state, shelf) => {
  state.activeShelf = shelf;
};

const toggleModal = (state) => {
  state.open.modal = !state.open.modal;
};

const setModal = (state, boolean) => {
  state.open.modal = boolean;
};

const closeAllModals = (state) => {
  Object.keys(state.open).forEach((key) => {
    state.open[key] = false;
  });
};

const toggleheaderDropdown = (state) => {
  state.open.headerDropdown = !state.open.headerDropdown;
};

const toggleUpdateProgress = (state) => {
  state.open.updateProgress = !state.open.updateProgress;
};

const setUpdateProgressVisible = (state, boolean) => {
  state.open.updateProgress = boolean;
};

const toggleUpdateGoal = (state) => {
  state.open.updateGoal = !state.open.updateGoal;
};

const setUpdateGoalVisible = (state, boolean) => {
  state.open.updateGoal = boolean;
};

const setLibraryShelfSelectOpen = (state, boolean) => {
  state.open.libraryShelfSelect = boolean;
};

const toggleLibraryShelfSelectOpen = (state) => {
  state.open.libraryShelfSelect = !state.open.libraryShelfSelect;
};

const setShelvesLoading = (state, loading) => {
  state.loading.shelves = loading;
};

const setDetailedBookLoading = (state, loading) => {
  state.loading.detailedBook = loading;
};

const addBook = (state, book) => {
  state.books.push(book);
};

const setSearchResultsOpen = (state, boolean) => {
  state.open.searchResults = boolean;
};

const deleteBook = (state, book) => {
  state.books = state.books.filter((b) => b.id !== book.id);
};

const setConfirmAction = (state, confirmAction) => {
  state.confirmAction = confirmAction;
};

const deleteShelf = (state, shelf) => {
  state.shelves = state.shelves.filter((s) => s.id !== shelf.id);
};

const setBookToAdd = (state, book) => {
  state.bookToAdd = book;
};

const updateBookInBooks = (state, book) => {
  state.books = state.books.filter((b) => b.id !== book.id);
  state.books.push(book);
};

const setActiveShelfLoading = (state, loading) => {
  state.loading.activeShelf = loading;
};

const setBooksLoading = (state, loading) => {
  state.loading.books = loading;
};

export default {
  setUser,
  setUserLoading,
  setShelvesLoading,
  setUserProfile,
  setBooks,
  setDetailedBook,
  addShelf,
  setShelves,
  setShelf,
  setActiveShelf,
  toggleModal,
  closeAllModals,
  setModal,
  toggleheaderDropdown,
  toggleUpdateProgress,
  setUpdateProgressVisible,
  toggleUpdateGoal,
  setUpdateGoalVisible,
  setLibraryShelfSelectOpen,
  toggleLibraryShelfSelectOpen,
  setDetailedBookLoading,
  addBook,
  setSearchResultsOpen,
  deleteBook,
  setConfirmAction,
  deleteShelf,
  setBookToAdd,
  updateBookInBooks,
  setActiveShelfLoading,
  setBooksLoading,
};
