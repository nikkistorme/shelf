import { bookSchema } from "~/services/bookService";

export default defineEventHandler(async (event) => {
  const { query, quantity } = await readBody(event);
  let books = [];

  const baseURL = process.env.GOOGLE_BOOKS_API_URL;
  const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const googleParams = new URLSearchParams();

  googleParams.set("q", query);
  googleParams.set("key", googleBooksApiKey);
  googleParams.set("maxResults", quantity);

  try {
    const response = await fetch(`${baseURL}?${googleParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data?.items.length) {
      books = data.items.map((volume) => {
        if (volume?.volumeInfo) {
          const book = bookSchema();
          const result = volume.volumeInfo;
          const resultIdentifiers = result.industryIdentifiers || [];
          const isbn10 = resultIdentifiers.find((i) => i.type === "ISBN_10");
          const isbn13 = resultIdentifiers.find((i) => i.type === "ISBN_13");
          if (result?.authors?.length) book.author = result.authors[0];
          if (result.description) book.description = result.description;
          if (isbn10) book.isbn = isbn10.identifier;
          if (isbn13) book.isbn_13 = isbn13.identifier;
          if (result?.publisher) book.publisher = result.publisher;
          if (result?.title) book.title = result.title;
          if (result?.pageCount) book.total_pages = result.pageCount;
          return book;
        }
      });
    }
    return books;
  } catch (error) {
    return error;
  }
});
