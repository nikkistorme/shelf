import shelfService from "../../services/shelfService.js";
import { updateBookShelves } from "../../services/bookService.js";

const addShelf = async ({ commit, state }, shelfName) => {
  commit("setShelvesLoading", true);
  let shelf = null;
  try {
    shelf = shelfService.newShelfObject(shelfName, state.user.uid);
    await shelfService.addShelf(shelf);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("addShelf", shelf);
  commit("setShelvesLoading", false);
  return shelf;
};

const getShelves = async ({ commit, dispatch }) => {
  commit("setShelvesLoading", true);
  try {
    const shelves = await shelfService.getShelves();
    commit("setShelves", shelves);
    await dispatch("normalizeShelves");
  } catch (error) {
    console.log(error);
    throw error;
  }
  commit("setShelvesLoading", false);
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

const updateActiveShelfName = async ({ commit, state }, name) => {
  commit("setShelvesLoading", true);
  try {
    let shelf = state.activeShelf;
    shelf.name = name;
    await shelfService.updateShelfName(shelf);
    commit("setShelf", shelf);
    commit("setActiveShelf", shelf);
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("setShelvesLoading", false);
};

const deleteShelf = async ({ commit, state }, shelf) => {
  commit("setShelvesLoading", true);
  try {
    await shelfService.deleteShelf(shelf);
    let booksToUpdate = state.books.filter((book) => {
      return book.shelves.find((s) => s === shelf.id);
    });
    booksToUpdate = booksToUpdate.map((book) => {
      let newShelves = book.shelves.filter((s) => s !== shelf.id);
      book.shelves = newShelves;
      return book;
    });
    if (booksToUpdate.length > 0) {
      await Promise.all(booksToUpdate.map((b) => updateBookShelves(b)));
    }
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
  commit("deleteShelf", shelf);
  commit("setShelvesLoading", false);
};

const normalizeShelves = async ({ commit, state }) => {
  const shelvesToMake = [];
  const shelvesToUpdate = [];
  let allBooksShelf = null;
  let finishedShelf = null;
  let inProgressShelf = null;
  let unreadShelf = null;
  state.shelves.forEach((shelf) => {
    if (!shelf.sort) {
      shelf.sort = { descending: true, method: "date-added-to-library" };
      shelvesToUpdate.push(shelf);
    }
    if (shelf.allBooksShelf) {
      allBooksShelf = shelf;
    } else if (shelf.finishedShelf) {
      finishedShelf = shelf;
    } else if (shelf.inProgressShelf) {
      inProgressShelf = shelf;
    } else if (shelf.unreadShelf) {
      unreadShelf = shelf;
    }
  });
  if (!allBooksShelf?.id) {
    let newShelf = shelfService.newShelfObject("All Books", state.user.uid);
    newShelf.allBooksShelf = true;
    shelvesToMake.push(newShelf);
  }
  if (!finishedShelf?.id) {
    let newShelf = shelfService.newShelfObject("Finished", state.user.uid);
    newShelf.finishedShelf = true;
    shelvesToMake.push(newShelf);
  }
  if (!inProgressShelf?.id) {
    let newShelf = shelfService.newShelfObject("In Progress", state.user.uid);
    newShelf.inProgressShelf = true;
    shelvesToMake.push(newShelf);
  }
  if (!unreadShelf?.id) {
    let newShelf = shelfService.newShelfObject("Unread", state.user.uid);
    newShelf.unreadShelf = true;
    shelvesToMake.push(newShelf);
  }
  try {
    if (shelvesToMake.length > 0) {
      console.log("🚀 ~ shelvesToMake", shelvesToMake);
      await shelfService.addShelves(shelvesToMake);
    }

    if (shelvesToUpdate.length > 0) {
      console.log("🚀 ~ shelvesToUpdate", shelvesToUpdate);
      await shelfService.updateShelves(shelvesToUpdate);
    }
    if (shelvesToMake.length > 0 || shelvesToUpdate.length > 0) {
      const shelves = await shelfService.getShelves();
      commit("setShelves", shelves);
    }
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

export default {
  addShelf,
  getShelves,
  updateShelfSort,
  updateActiveShelfName,
  deleteShelf,
  normalizeShelves,
};
