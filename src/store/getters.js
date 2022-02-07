const books = state => state.books;
const currentUser = state => state.currentUser;
const drawer = state => state.drawer;
const shelves = state => state.shelves;
const showNav = state => state.showNav;
const status = state => state.status;
const userProfile = state => state.userProfile;
const getBookById = state => id => {
  return state.books.find(book => book.id === id);
};

export default {
  books,
  currentUser,
  drawer,
  shelves,
  showNav,
  status,
  userProfile,
  getBookById
};
