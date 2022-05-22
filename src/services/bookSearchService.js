import fb from "../firebase";
import { v4 as uuidv4 } from "uuid";

const newID = () => {
  return uuidv4().toLowerCase();
};

export const coreBookSchema = () => {
  let book = {
    author: "",
    description: "",
    id: "",
    image: "",
    title: "",
    totalPages: "",
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

export const newCoreBookObject = (book) => {
  let newBook = Object.assign(coreBookSchema(), book);
  newBook.id = newID();
  newBook.type = "core";
  newBook.created = new Date().toISOString();
  return newBook;
};

const stringFromArrayOfStrings = (arrayOfStrings) => {
  let newString = "";
  let i;
  for (i = 0; i < arrayOfStrings.length; i++) {
    if (!newString.length) {
      newString = arrayOfStrings[i];
    } else {
      newString += `, ${arrayOfStrings[i]}`;
    }
  }
  return newString;
};

export const searchCoreBooks = async (searchTerm) => {
  console.log("🚀 ~ searchTerm", searchTerm);
  const coreBooks = [];
  try {
    const querySnapshot = await fb.coreBooksCollection
      .orderBy("title")
      .startAt(searchTerm)
      // .endAt([searchTerm + "\uf8ff"])
      .limit(5)
      .get();
    querySnapshot.forEach((doc) => coreBooks.push(doc.data()));
  } catch (error) {
    throw formatError(error);
  }
  return coreBooks;
};

const searchBooks = async (searchTerm) => {
  const baseURL = "https://www.googleapis.com/books/v1/volumes";
  const googleBooksApiKey = import.meta.env.VITE_VERCEL_GOOGLE_BOOKS_API_KEY;
  const googleParams = new URLSearchParams();
  googleParams.set("q", searchTerm);
  googleParams.set("key", googleBooksApiKey);
  googleParams.set("maxResults", 5);
  try {
    // const coreBooks = await searchCoreBooks(searchTerm);
    // console.log("🚀 ~ coreBooks", coreBooks);
    const response = await fetch(`${baseURL}?${googleParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    let books = [];
    if (data?.items.length) {
      books = data.items.map((volume) => {
        if (volume.volumeInfo) {
          const result = volume.volumeInfo;
          const book = coreBookSchema();
          if (result.authors) {
            book.author = stringFromArrayOfStrings(result.authors);
          } else {
            book.author = result.author;
          }
          if (result.description) book.description = result.description;
          if (result.imageLinks?.thumbnail) {
            book.image = result.imageLinks.thumbnail;
          }
          book.title = result.title;
          book.totalPages = result.pageCount;
          return book;
        }
      });
    }
    return books;
  } catch (error) {
    throw formatError(error);
  }
};

const getCoreBook = async (bookId) => {
  try {
    const book = await fb.coreBooksCollection.doc(bookId).get();
    return book.data();
  } catch (error) {
    throw formatError(error);
  }
};

const addCoreBook = async (book) => {
  try {
    await fb.coreBooksCollection.add(book);
  } catch (error) {
    throw formatError(error);
  }
};

export default {
  coreBookSchema,
  newCoreBookObject,
  searchBooks,
  getCoreBook,
  addCoreBook,
};
