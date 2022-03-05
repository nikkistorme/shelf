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

const toggleProfileDropdown = (state) => {
  state.open.profileDropdown = !state.open.profileDropdown;
};

const toggleUpdateProgress = (state) => {
  state.open.updateProgress = !state.open.updateProgress;
};

const toggleUpdateGoal = (state) => {
  state.open.updateGoal = !state.open.updateGoal;
};

export default {
  setUser,
  setUserLoading,
  setUserProfile,
  setBooks,
  setDetailedBook,
  addShelf,
  setShelves,
  setShelf,
  toggleModal,
  closeAllModals,
  setModal,
  toggleProfileDropdown,
  toggleUpdateProgress,
  toggleUpdateGoal,
};
