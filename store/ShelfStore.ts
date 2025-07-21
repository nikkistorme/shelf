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

type ShelfState = {
  shelves: Shelf[]
  activeShelf: Shelf | null
  loading: boolean
}

export const useShelfStore = defineStore("ShelfStore", {
  state: (): ShelfState => ({
    shelves: [],
    activeShelf: null,
    loading: false,
  }),
  getters: {
    allBooksShelf(): Shelf | null {
      return this.shelves.find((shelf) => shelf?.locked_type === "all_books") || null;
    },
    finishedShelf(): Shelf | null {
      return this.shelves.find((shelf) => shelf?.locked_type === "finished") || null;
    },
    inProgressShelf(): Shelf | null {
      return this.shelves.find((shelf) => shelf?.locked_type === "in_progress") || null;
    },
    unreadShelf(): Shelf | null {
      return this.shelves.find((shelf) => shelf?.locked_type === "unread") || null;
    },
    getShelfById() {
      return (id: Shelf["id"]): Shelf | null => {
        if (typeof id === "string") id = parseInt(id);
        return this.shelves.find((shelf) => shelf.id === id) || null;
      };
    },
    getSortedShelves(): Shelf[] {
      return sortShelves(this.shelves);
    },
  },
  actions: {
    async confirmLockedShelves() {
      const lockedShelves: Shelf[] = this.shelves.filter((shelf) => shelf.locked_type);
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
        const newShelves: Shelf[] = await createNecessaryShelves(shelvesToCreate);
        this.shelves = sortShelves([...this.shelves, ...newShelves]);
        return;
      } catch (error) {
        throw error;
      }
    },
    async createNewShelf(name: Shelf["name"]) {
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
    async setActiveShelf(shelf: Shelf) {
      const bookStore = useBookStore();
      this.loading = true;
      this.activeShelf = shelf;
      let userBooks: UserBook[] | null;
      try {
        userBooks = await fetchBooksForShelf(shelf);
        // This can be done in the synchronously background
        this.setShelfProperties(shelf.id, {
          book_count: userBooks?.length ? userBooks.length : 0,
        });
      } catch (error) {
        this.loading = false;
        throw error;
      }
      if (userBooks?.length) bookStore.userBooks = userBooks;
      this.loading = false;
    },
    async updateShelfSort(shelf: Shelf) {
      this.loading = true;
      let updatedShelf: Shelf | null;
      try {
        updatedShelf = await updateShelfSort(shelf);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.map((s: Shelf) => {
        if (s.id === updatedShelf?.id) return updatedShelf;
        return s;
      })
      this.loading = false;
    },
    async updateShelfName(shelf_id: Shelf["id"], newName: Shelf["name"]) {
      this.loading = true;
      let updatedShelf: Shelf | null;
      try {
        updatedShelf = await updateShelfName(shelf_id, newName);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.map((s: Shelf) => {
        if (s.id === updatedShelf?.id) return updatedShelf;
        return s;
      })
      if (updatedShelf?.id === this.activeShelf?.id)
        this.activeShelf = updatedShelf;
      this.loading = false;
    },
    async deleteShelf(shelf_id: Shelf["id"]) {
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
    async setShelfProperties(shelf_id: Shelf["id"], properties: Partial<Shelf>) {
      this.loading = true;
      try {
        await setShelfProperties(shelf_id, properties);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async incrementShelfCount(shelf_id: Shelf["id"], count: number) {
      this.loading = true;
      const oldShelf = this.shelves.find(
        (s) => s.id.toString() === shelf_id.toString()
      );
      if (!oldShelf) {
        this.loading = false;
        throw new Error("Shelf not found");
      }
      const newCount = oldShelf.book_count + count;
      let updatedShelf: Shelf | null;
      try {
        updatedShelf = await setShelfProperties(shelf_id, {
          book_count: newCount,
        });
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.shelves = this.shelves.map((s: Shelf) => {
        if (s.id === updatedShelf?.id) return updatedShelf;
        return s;
      })
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
