import router from "../../router";

import userService from "../../services/userService.js";
import shelfService from "../../services/shelfService.js";

const signUp = async ({ commit }, credentials) => {
  commit("setUserLoading", true);
  try {
    const userAccount = await userService.signUp(credentials);
    commit("setUser", userAccount);
    const user = await userService.createUser({
      id: userAccount.uid,
      name: credentials.name,
      activeShelf: "",
      image: "",
    });
    commit("setUserProfile", user);
    const newShelf = await shelfService.createShelf({
      books: [],
      changes: [],
      inProgressShelf: true,
      name: "In Progress",
      sort: {
        descending: true,
        method: "dateAdded",
      },
    });
    commit("addShelf", newShelf);
    commit("setUserLoading", false);
  } catch (error) {
    console.log(error);
    commit("setUserLoading", false);
  }
};

const signIn = async ({ commit }, credentials) => {
  commit("setUserLoading", true);
  try {
    const user = await userService.signIn(credentials);
    commit("setUser", user);
    const userProfile = await userService.getUser(user.uid);
    commit("setUserProfile", userProfile);
    commit("setUserLoading", false);
    router.push("./home");
  } catch (error) {
    console.log(error);
    commit("setUserLoading", false);
    throw error;
  }
};

const signOut = async ({ commit }) => {
  try {
    await userService.signOut();
    commit("setUser", {});
    router.push("./");
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line no-unused-vars
const resetPassword = async ({ commit }, email) => {
  try {
    await userService.resetPassword(email);
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

const updatePassword = async ({ commit }, password) => {
  commit("setUserLoading", true);
  try {
    await userService.updatePassword(password);
  } catch (error) {
    commit("setUserLoading", false);
    throw error;
  }
  commit("setUserLoading", false);
};

const getUserProfile = async ({ commit }, uid) => {
  commit("setUserLoading", true);
  try {
    const userProfile = await userService.getUser(uid);
    commit("setUserProfile", userProfile);
    commit("setUserLoading", false);
  } catch (error) {
    console.log(error);
    commit("setUserLoading", false);
  }
};

export default {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  getUserProfile,
};
