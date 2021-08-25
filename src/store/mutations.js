const setUserBooks = (state, payload) => {
  state.books = payload;
};

const setCurrentUser = (state, payload) => {
  state.currentUser = payload;
};

const setUserProfile = (state, payload) => {
  state.userProfile = payload;
  console.log("state.userProfile", state.userProfile);
};

const removeUser = state => {
  state.currentUser = null;
};

const setStatus = (state, payload) => {
  state.status = payload;
};

const setUserShelves = (state, payload) => {
  state.shelves = payload;
};

const changeNav = state => {
  state.showNav = !state.showNav;
};

const setDrawer = (state, payload) => {
  state.drawer.open = true;
  state.drawer.content = payload;
};

const closeDrawer = state => {
  state.drawer.open = false;
  setTimeout(() => {
    state.drawer.content = {};
  }, 500);
};

export default {
  setUserBooks,
  setCurrentUser,
  setUserProfile,
  removeUser,
  setStatus,
  setUserShelves,
  changeNav,
  setDrawer,
  closeDrawer
};
