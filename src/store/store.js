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
    detailedBook: "",
    activeShelf: {},
    loading: {
      user: false,
      books: false,
      shelves: false,
    },
    open: {
      modal: false,
      profileDropdown: false,
      bookDetails: false,
      updateProgress: false,
      updateGoal: false,
      libraryShelfSelect: false,
    },
  },
  getters,
  mutations,
  actions,
});
