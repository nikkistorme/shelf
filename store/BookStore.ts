import { defineStore } from "pinia";
import { useShelfStore } from "./ShelfStore";

import {
  addNewBook,
  addBookToLibrary,
  fetchUserBooks,
  fetchInProgressBooks,
  fetchBook,
  startReadingBook,
  updateProgress,
  updateUserBook,
  removeBookFromLibrary,
} from "~~/services/bookService";

type BookId = UserBook["id"];

type UserState = {
  userBooks: UserBook[]
  book: BookEdition | null
  userBook: UserBook | null
  loading: boolean
  bookToAdd: BookEdition | null
}

export const useBookStore = defineStore("BookStore", {
  state: (): UserState => ({
    userBooks: [],
    book: null,
    userBook: null,
    loading: false,
    bookToAdd: null,
  }),
  getters: {
    inProgressBooks(): UserBook[] {
      if (!this.userBooks?.length) return [];
      return (
        this.userBooks.filter((book) => book.status === "in_progress") || []
      );
    },
    getBookById() {
      return (bookId: BookId): UserBook | null => {
        if (!this.userBooks?.length) return null;
        return this.userBooks.find((b: UserBook) => b.id === bookId) || null;
      };
    },
    booksOnShelf() {
      return (shelf: Shelf) => {
        if (!this.userBooks?.length) return [];
        switch (shelf?.locked_type) {
          case "all_books":
            return this.userBooks;
          case "finished":
            return this.userBooks.filter((b) => b.status === "finished");
          case "in_progress":
            return this.userBooks.filter((b) => b.status === "in_progress");
          case "unread":
            return this.userBooks.filter((b) => b.status === "unread");
          default:
            return this.userBooks.filter((b) =>
              b.shelves?.find((s_id) => s_id.toString() === shelf.id.toString())
            );
        }
      };
    },
  },
  actions: {
    async addNewBook(): Promise<void> {
      if (!this.bookToAdd) return;
      this.loading = true;
      let newBook;
      try {
        newBook = await addNewBook(this.bookToAdd);
        await this.addBookToLibrary(newBook);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.book = newBook;
      this.loading = false;
    },
    async addBookToLibrary(book: BookEdition | null = null): Promise<void> {
      this.loading = true;
      if (!book?.id) {
        book = this.book;
      }
      let userBook;
      try {
        userBook = await addBookToLibrary(book);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.userBook = userBook;
      this.userBooks.push(userBook);
      this.loading = false;
    },
    async fetchUserBooks(): Promise<void> {
      this.loading = true;
      try {
        const books = await fetchUserBooks();
        this.userBooks = books;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async fetchInProgressBooks(): Promise<void> {
      this.loading = true;
      let books: UserBook[] | [] = [];
      try {
        books = await fetchInProgressBooks();
        this.userBooks = books;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async fetchBook(book_id: UserBook["id"]): Promise<void> {
      this.loading = true;
      try {
        const { book, userBook } = await fetchBook(book_id);
        this.book = book;
        if (userBook?.base === book.id) this.userBook = userBook;
        else this.userBook = null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.loading = false;
    },
    async startReadingBook(user_book: UserBook): Promise<void> {
      this.loading = true;
      let updatedBook: UserBook | null;
      try {
        updatedBook = await startReadingBook(user_book);
        const shelfStore = useShelfStore();
        shelfStore.updateInProgressShelfCount();
      } catch (error) {
        this.loading = false;
        throw error;
      }
      if (updatedBook?.id) {
        this.userBook = updatedBook;
        this.userBooks = this.userBooks.map((book: UserBook): UserBook => {
          if (book?.id === updatedBook?.id) return updatedBook;
          return book;
        });
      }
      this.loading = false;
    },
    async updateProgress(user_book_id: UserBook["id"], book_updates: Partial<UserBook>): Promise<void> {
      this.loading = true;
      let updatedBook;
      try {
        updatedBook = await updateProgress(user_book_id, book_updates);
      } catch (error) {
        throw error;
      }
      if (updatedBook?.id) this.userBook = updatedBook;
      this.loading = false;
    },
    async setGoal(user_book_id: UserBook["id"], book_updates: Partial<UserBook>): Promise<void> {
      this.loading = true;
      let updatedBook;
      try {
        updatedBook = await updateUserBook(user_book_id, book_updates);
      } catch (error) {
        throw error;
      }
      if (updatedBook?.id) this.userBook = updatedBook;
      this.loading = false;
    },
    async finishReadingBook(user_book_id: UserBook["id"], book_updates: Partial<UserBook>): Promise<void> {
      this.loading = true;
      let updatedBook;
      try {
        updatedBook = await updateUserBook(user_book_id, book_updates);
        const shelfStore = useShelfStore();
        shelfStore.updateInProgressShelfCount();
      } catch (error) {
        this.loading = false;
        throw error;
      }
      if (updatedBook?.id) this.userBook = updatedBook;
      this.loading = false;
    },
    async uploadNewCoverImage(user_book_id: UserBook["id"], book_updates: Partial<UserBook>): Promise<void> {
      this.loading = true;
      let updatedBook;
      try {
        updatedBook = await updateUserBook(user_book_id, book_updates);
      } catch (error) {
        throw error;
      }
      if (updatedBook?.id) this.userBook = updatedBook;
      this.loading = false;
    },
    async updateUserBook(user_book_id: UserBook["id"], book_updates: Partial<UserBook>): Promise<void> {
      this.loading = true;
      let updatedBook;
      try {
        updatedBook = await updateUserBook(user_book_id, book_updates);

        if (book_updates?.status) {
          const shelfStore = useShelfStore();
          shelfStore.updateInProgressShelfCount();
        }
      } catch (error) {
        throw error;
      }
      if (updatedBook?.id) this.userBook = updatedBook;
      this.loading = false;
    },
    async removeBookFromLibrary(book_id: UserBook["id"]): Promise<void> {
      this.loading = true;
      try {
        await removeBookFromLibrary(book_id);
      } catch (error) {
        this.loading = false;
        throw error;
      }
      this.userBook = null;
      this.loading = false;
    },
  },
});
