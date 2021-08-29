import Vue from "vue";

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
  Vue.set(state.drawer, "open", true);
  Vue.set(state.drawer, "content", payload.content);
  Vue.set(state.drawer, "type", payload.type);
};

const closeDrawer = state => {
  Vue.set(state.drawer, "open", false);
  setTimeout(() => {
    Vue.set(state.drawer, "content", {});
    Vue.set(state.drawer, "type", "");
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
