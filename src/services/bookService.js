import fb from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { makeChange } from "./changeService";

const newID = () => {
  return uuidv4().toLowerCase();
};

export const bookSchema = () => {
  let book = {
    author: "",
    changes: [],
    description: "",
    finished: false,
    finishedDate: "",
    goal: {
      goalDate: "",
      startDate: "",
      targetPage: 0,
    },
    id: "",
    image: "",
    inProgress: false,
    readPages: 0,
    shelves: [],
    title: "",
    totalPages: "",
    user: "",
    created: "",
  };
  return book;
};

const formatError = (error) => {
  console.log("🚀 ~ error", error);
  console.log("🚀 ~ error.code", error.code);
  switch (error.code) {
    case "invalid-argument":
      return new Error(
        "Invalid request. Please contact Shelf to resolve this issue."
      );
    default:
      return error;
  }
};

export const newBookObject = (book, user = "") => {
  let newBook = Object.assign(bookSchema(), book);
  newBook.user = user;
  newBook.id = newID();
  newBook.changes.push(
    makeChange("addBook", { oldValue: null, newValue: null })
  );
  return newBook;
};

const addBook = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).set(book);
  } catch (error) {
    console.log("🚀 ~ error", error);
  }
};

const getBook = async (id) => {
  try {
    const doc = await fb.booksCollection.doc(id).get();
    return doc.data();
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const getBooks = async () => {
  let allBooks = [];
  try {
    const querySnapshot = await fb.booksCollection
      .where("user", "==", fb.auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let book = doc.data();
      allBooks.push(book);
    });
  } catch (error) {
    throw formatError(error);
  }
  return allBooks;
};

const updatePage = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      readPages: book.readPages,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const setGoal = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      goal: book.goal,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const finishReading = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      finished: book.finished,
      goal: book.goal,
      readPages: book.readPages,
      inProgress: book.inProgress,
      changes: book.changes,
    });
  } catch (error) {
    throw formatError(error);
  }
};

export const updateBookShelves = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      shelves: book.shelves,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const updateBookField = async (book, field) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      [field]: book[field],
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const startReadingBook = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).update({
      inProgress: book.inProgress,
      readPages: book.readPages,
      changes: book.changes,
    });
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

const deleteBook = async (book) => {
  try {
    await fb.booksCollection.doc(book.id).delete();
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw formatError(error);
  }
};

export default {
  bookSchema,
  addBook,
  newBookObject,
  getBook,
  getBooks,
  updatePage,
  setGoal,
  finishReading,
  updateBookShelves,
  updateBookField,
  startReadingBook,
  deleteBook,
};
