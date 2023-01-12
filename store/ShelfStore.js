import { defineStore } from "pinia";
import {
  sortShelves,
  createNecessaryShelves,
  createNewShelf,
  fetchShelves,
  fetchBooksForShelf,
  updateShelfSort,
  updateShelfName,
  deleteShelf,
  setShelfProperties,
  getInProgressShelfCount,
  updateInProgressShelfCount,
} from "~/services/shelfService";
import { useBookStore } from "./BookStore";

export const useShelfStore = defineStore("ShelfStore", {
  state: () => ({
    shelves: [],
    activeShelf: null,
    loading: false,
  }),
  getters: {
    allBooksShelf() {
      return this.shelves.find((shelf) => shelf?.all_books_shelf);
    },
    finishedShelf() {
      return this.shelves.find((shelf) => shelf?.finished_shelf);
    },
    inProgressShelf() {
      return this.shelves.find((shelf) => shelf?.in_progress_shelf);
    },
    unreadShelf() {
      return this.shelves.find((shelf) => shelf?.unread_shelf);
    },
    editableShelves() {
      return this.shelves.filter(
        (shelf) =>
          !shelf.all_books_shelf &&
          !shelf.finished_shelf &&
          !shelf.in_progress_shelf &&
          !shelf.unread_shelf
      );
    },
    getShelfById() {
      return (id) => this.shelves.find((shelf) => shelf.id === parseInt(id));
    },
    getSortedShelves() {
      const allBooks = this.shelves.find((shelf) => shelf.all_books_shelf);
      const finished = this.shelves.find((shelf) => shelf.finished_shelf);
      const inProgress = this.shelves.find((shelf) => shelf.in_progress_shelf);
      const unread = this.shelves.find((shelf) => shelf.unread_shelf);
      const sorted = this.shelves.filter(
        (shelf) =>
          !shelf.all_books_shelf &&
          !shelf.finished_shelf &&
          !shelf.in_progress_shelf &&
          !shelf.unread_shelf
      );
      sorted.sort((a, b) => (a.name > b.name ? 1 : -1));
      if (unread) sorted.unshift(unread);
      if (inProgress) sorted.unshift(inProgress);
      if (finished) sorted.unshift(finished);
      if (allBooks) sorted.unshift(allBooks);
      return sorted;
    },
  },
  actions: {
    async confirmNecessaryShelves() {
      const shelvesToCreate = [];
      if (!this.shelves.find((shelf) => shelf?.all_books_shelf))
        shelvesToCreate.push("all_books_shelf");
      if (!this.shelves.find((shelf) => shelf?.finished_shelf))
        shelvesToCreate.push("finished_shelf");
      if (!this.shelves.find((shelf) => shelf?.in_progress_shelf))
        shelvesToCreate.push("in_progress_shelf");
      if (!this.shelves.find((shelf) => shelf?.unread_shelf))
        shelvesToCreate.push("unread_shelf");
      if (!shelvesToCreate.length) return;
      console.log("🚀 ~ shelvesToCreate", shelvesToCreate);
      try {
        await createNecessaryShelves(shelvesToCreate);
        return;
      } catch (error) {
        throw error;
      }
    },
    async createNewShelf(name) {
      this.loading = true;
      let newShelf;
      try {
        newShelf = await createNewShelf(name);
        console.log("🚀 ~ newShelf", newShelf);
      } catch (error) {
        throw error;
      }
      this.shelves.push(newShelf);
      this.loading = false;
    },
    async fetchShelves() {
      this.loading = true;
      const userAuth = useSupabaseUser();
      let shelves;
      try {
        shelves = await fetchShelves();
        this.shelves = sortShelves(shelves);
        if (!userAuth) await this.confirmNecessaryShelves();
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async setActiveShelf(shelf) {
      const bookStore = useBookStore();
      this.loading = true;
      this.activeShelf = shelf;
      let userBooks;
      try {
        userBooks = await fetchBooksForShelf(shelf);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      bookStore.userBooks = userBooks;
      this.loading = false;
    },
    async updateShelfSort(shelf) {
      this.loading = true;
      let updatedShelf;
      try {
        updatedShelf = await updateShelfSort(shelf);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.filter((s) => s.id !== updatedShelf.id);
      this.shelves.push(updatedShelf);
      this.loading = false;
    },
    async updateShelfName(shelf_id, newName) {
      this.loading = true;
      let updatedShelf;
      try {
        updatedShelf = await updateShelfName(shelf_id, newName);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.filter((s) => s.id !== updatedShelf.id);
      this.shelves.push(updatedShelf);
      if (updatedShelf?.id === this.activeShelf?.id)
        this.activeShelf = updatedShelf;
      this.loading = false;
    },
    async deleteShelf(shelf_id) {
      this.loading = true;
      try {
        await deleteShelf(shelf_id);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.filter((s) => s.id !== shelf_id);
      this.loading = false;
    },
    async setShelfProperties(shelf_id, properties) {
      this.loading = true;
      try {
        await setShelfProperties(shelf_id, properties);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async incrementShelfCount(shelf_id, count) {
      this.loading = true;
      const oldShelf = this.shelves.find(
        (s) => s.id.toString() === shelf_id.toString()
      );
      const newCount = oldShelf.book_count + count;
      let updatedShelf;
      try {
        updatedShelf = await setShelfProperties(shelf_id, {
          book_count: newCount,
        });
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.filter((s) => s.id !== updatedShelf.id);
      this.shelves.push(updatedShelf);
      this.loading = false;
    },
    async updateInProgressShelfCount() {
      const inProgressShelfCount = await getInProgressShelfCount();
      const inProgressShelf = await updateInProgressShelfCount(
        inProgressShelfCount
      );
      this.shelves.filter((shelf) => shelf.id !== inProgressShelf.id);
      this.shelves.push(inProgressShelf);
    },
  },
});
