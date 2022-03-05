const user = (state) => {
  return state.user;
};

const userProfile = (state) => {
  return state.userProfile;
};

const books = (state) => {
  return state.books;
};

const inProgressBooks = (state) => {
  return state.books.filter((book) => book.inProgress);
};

const getBookById = (state) => (id) => {
  return state.books.find((book) => book.id === id);
};

const detailedBook = (state) => {
  return state.detailedBook;
};

const shelves = (state) => {
  return state.shelves;
};

const getInProgressShelf = (state) => {
  return state.shelves.find((shelf) => shelf.inProgressShelf);
};

const getShelfById = (state) => (id) => {
  return state.shelves.find((shelf) => shelf.id === id);
};

const modalOpen = (state) => {
  return state.open.modal;
};

const profileDropdownOpen = (state) => {
  return state.open.profileDropdown;
};

const updateProgressOpen = (state) => {
  return state.open.updateProgress;
};

const updateGoalOpen = (state) => {
  return state.open.updateGoal;
};

export default {
  user,
  userProfile,
  books,
  inProgressBooks,
  getBookById,
  detailedBook,
  shelves,
  getInProgressShelf,
  getShelfById,
  modalOpen,
  profileDropdownOpen,
  updateProgressOpen,
  updateGoalOpen,
};
