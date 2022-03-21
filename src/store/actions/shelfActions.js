import shelfService from "../../services/shelfService.js";
import { updateBookShelves } from "../../services/bookService.js";

const addShelf = async ({ commit, state }, shelfName) => {
  try {
    let shelf = shelfService.newShelfObject(shelfName, state.user.uid);
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

const deleteShelf = async ({ commit, state }, shelf) => {
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
};

const normalizeShelves = async ({ commit, state }) => {
  commit("setShelvesLoading", true);
  const shelvesToMake = [];
  const shelvesToUpdate = [];
  let allBooksShelf = {};
  let finishedShelf = {};
  let inProgressShelf = {};
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
  try {
    if (shelvesToMake.length > 0) {
      console.log("🚀 ~ shelvesToMake", shelvesToMake);
      await shelfService.addShelves(shelvesToMake);
    }

    if (shelvesToUpdate.length > 0) {
      console.log("🚀 ~ shelvesToUpdate", shelvesToUpdate);
      await shelfService.updateShelves(shelvesToUpdate);
    }
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
  commit("setShelvesLoading", false);
};

export default {
  addShelf,
  getShelves,
  updateShelfSort,
  deleteShelf,
  normalizeShelves,
};
