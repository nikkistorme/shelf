import { createStore } from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions/actions";

export default createStore({
  state: {
    user: { uid: "" },
    userProfile: {},
    books: [],
    shelves: [],
    detailedBook: {},
    bookToAdd: {},
    activeShelf: {},
    confirmAction: {},
    loading: {
      user: false,
      books: false,
      shelves: false,
      detailedBook: false,
      activeShelf: false,
    },
    open: {
      modal: false,
      headerDropdown: false,
      bookDetails: false,
      updateProgress: false,
      updateGoal: false,
      libraryShelfSelect: false,
      hamburgerMenu: false,
      searchResults: false,
    },
  },
  getters,
  mutations,
  actions,
});
