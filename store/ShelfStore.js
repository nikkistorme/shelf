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
import { useUserStore } from "./UserStore";

export const useShelfStore = defineStore("ShelfStore", {
  state: () => ({
    shelves: [],
    activeShelf: null,
    loading: false,
  }),
  getters: {
    allBooksShelf() {
      return this.shelves.find((shelf) => shelf?.locked_type === "all_books");
    },
    finishedShelf() {
      return this.shelves.find((shelf) => shelf?.locked_type === "finished");
    },
    inProgressShelf() {
      return this.shelves.find((shelf) => shelf?.locked_type === "in_progress");
    },
    unreadShelf() {
      return this.shelves.find((shelf) => shelf?.locked_type === "unread");
    },
    getShelfById() {
      return (id) => this.shelves.find((shelf) => shelf.id === parseInt(id));
    },
    getSortedShelves() {
      return sortShelves(this.shelves);
    },
  },
  actions: {
    async confirmLockedShelves() {
      const lockedShelves = this.shelves.filter((shelf) => shelf.locked_type);
      if (lockedShelves.length === 4) return;
      const shelvesToCreate = [];
      if (!lockedShelves.find((s) => s?.locked_type === "all_books"))
        shelvesToCreate.push("all_books");
      if (!lockedShelves.find((s) => s?.locked_type === "finished"))
        shelvesToCreate.push("finished");
      if (!lockedShelves.find((s) => s?.locked_type === "in_progress"))
        shelvesToCreate.push("in_progress");
      if (!lockedShelves.find((s) => s?.locked_type === "unread"))
        shelvesToCreate.push("unread");
      if (!shelvesToCreate.length) return;
      console.log("🚀 ~ shelvesToCreate", shelvesToCreate);
      try {
        const newShelves = await createNecessaryShelves(shelvesToCreate);
        this.shelves = sortShelves([...this.shelves, ...newShelves]);
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
      } catch (error) {
        throw error;
      }
      this.shelves.push(newShelf);
      this.loading = false;
    },
    async fetchShelves() {
      this.loading = true;
      const userAuth = useSupabaseUser();
      const userStore = useUserStore();
      let shelves;
      try {
        shelves = await fetchShelves();
        this.shelves = sortShelves(shelves);
        if (userAuth?.value?.id && userStore.profile)
          await this.confirmLockedShelves();
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
        // This can be done in the synchronously background
        this.setShelfProperties(shelf.id, {
          book_count: userBooks.length,
        });
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
