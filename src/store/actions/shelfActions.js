import { v4 as uuidv4 } from "uuid";

import shelfService from "../../services/shelfService.js";

const newID = () => {
  return uuidv4().toLowerCase();
};

const shelfSchema = {
  name: "",
  user: "",
  id: "",
  sort: {
    descending: true,
    method: "date-added-to-library",
  },
};

const addShelf = async ({ commit, state }, shelfName) => {
  try {
    let shelf = Object.assign({}, shelfSchema);
    shelf.name = shelfName;
    shelf.user = state.user.uid;
    shelf.id = newID();
    await shelfService.addShelf(shelf);
    commit("addShelf", shelf);
    return shelf;
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
};

const getShelves = async ({ commit }) => {
  try {
    const shelves = await shelfService.getShelves();
    commit("setShelves", shelves);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateShelfSort = async ({ commit }, shelf) => {
  try {
    await shelfService.updateShelfSort(shelf);
    commit("setShelf", shelf);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  addShelf,
  getShelves,
  updateShelfSort,
};
