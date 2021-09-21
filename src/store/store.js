import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    books: [],
    currentUser: {},
    drawer: {
      content: {},
      open: false,
      type: ""
    },
    shelves: [],
    showNav: false,
    status: "",
    userProfile: {}
  },
  getters,
  mutations,
  actions
});
