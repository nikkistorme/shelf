import { bookSchema } from "./bookService";

const formatError = (error) => {
  console.log("🚀 ~ error", error.code);
  switch (error.code) {
    case "invalid-argument":
      return new Error(
        "Invalid request. Please contact Shelf to resolve this issue."
      );
    default:
      return error;
  }
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

const searchBooks = async (searchTerm) => {
  try {
    const baseURL = "https://www.googleapis.com/books/v1/volumes";
    const googleBooksApiKey = import.meta.env.VITE_VERCEL_GOOGLE_BOOKS_API_KEY;
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    params.set("key", googleBooksApiKey);
    params.set("maxResults", 5);
    const response = await fetch(`${baseURL}?${params.toString()}`, {
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
          const book = { ...bookSchema };
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

export default {
  bookSchema,
  searchBooks,
};
