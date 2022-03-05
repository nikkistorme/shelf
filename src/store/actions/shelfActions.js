import shelfService from "../../services/shelfService.js";

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
  getShelves,
  updateShelfSort,
};
