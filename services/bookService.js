import { newChange } from "./changeService";
import {
  getAllBooksShelfCount,
  updateAllBooksShelfCount,
} from "./shelfService";

export const bookSchema = () => {
  return {
    title: "",
    total_pages: null,
    author: "",
    description: "",
    cover: "",
    published: null,
    published_original: null,
    average_rating: null,
    publisher: "",
    isbn: "",
    isbn_13: "",
  };
};

export const userBookSchema = () => {
  return {
    title: "",
    author: "",
    description: "",
    goal: {
      startDate: "",
      targetDate: "",
      targetPage: null,
    },
    cover: "",
    current_page: null,
    total_pages: null,
    user_id: "",
    base: "",
    shelves: [],
    changes: [],
    minutes_per_page: null,
    status: "unread",
    readthroughs: [],
  };
};

export const addNewBook = async (book) => {
  const supabase = useSupabaseClient();
  try {
    const { data: newBook, error } = await supabase
      .from("books_edition")
      .insert([book]);
    if (error) throw error;
    return newBook[0];
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
};

export const addBookToLibrary = async (book) => {
  const supabase = useSupabaseClient();
  const userAuth = useSupabaseUser();
  const change = newChange("addBookToLibrary", book);
  let newBook = userBookSchema();
  newBook.author = book.author;
  newBook.base = book.id;
  newBook.changes = [change];
  newBook.cover = book.cover;
  newBook.description = book.description;
  newBook.title = book.title;
  newBook.total_pages = book.total_pages;
  newBook.user_id = userAuth.value.id;
  try {
    const { data: userBook, error: userBookError } = await supabase
      .from("books_user")
      .insert([newBook]);

    const allBooksShelfCount = await getAllBooksShelfCount();
    await updateAllBooksShelfCount(allBooksShelfCount);

    return userBook[0];
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
};

export const fetchUserBooks = async () => {
  const supabase = useSupabaseClient();
  try {
    const { data: books, error } = await supabase.from("books_user").select();
    if (error) throw error;
    return books;
  } catch (error) {
    throw error;
  }
};

export const fetchInProgressBooks = async () => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("books_user")
      .select()
      .eq("status", "in_progress");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchBook = async (book_id) => {
  const supabase = useSupabaseClient();
  try {
    const { data: book, error: bookError } = await supabase
      .from("books_edition")
      .select()
      .eq("id", book_id);
    if (bookError) throw bookError;
    const { data: userBook, error: userBookError } = await supabase
      .from("books_user")
      .select()
      .eq("base", book_id);
    if (userBookError) throw userBookError;
    return { book: book[0], userBook: userBook[0] };
  } catch (error) {
    throw error;
  }
};

export const startReadingBook = async (user_book) => {
  const supabase = useSupabaseClient();
  const change = newChange("startReadingBook", user_book);
  const bookUpdates = {
    current_page: 0,
    changes: [...user_book.changes, change],
    status: "in_progress",
  };
  bookUpdates.changes.sort((a, b) => {
    return a.created > b.created ? -1 : 1;
  });
  let updatedBook;
  try {
    const { data } = await supabase
      .from("books_user")
      .update(bookUpdates)
      .match({ id: user_book.id });
    updatedBook = data[0];
  } catch (error) {
    throw error;
  }
  return updatedBook;
};

export const updateProgress = async (user_book_id, book_updates) => {
  const supabase = useSupabaseClient();
  try {
    const { data: updatedBook, error } = await supabase
      .from("books_user")
      .update(book_updates)
      .match({ id: user_book_id });
    if (error) throw error;
    return updatedBook[0];
  } catch (error) {
    throw error;
  }
};

export const finishReadingBook = async (user_book_id, book_updates) => {
  const supabase = useSupabaseClient();
  try {
    const { data: updatedBook, error } = await supabase
      .from("books_user")
      .update(book_updates)
      .match({ id: user_book_id });
    if (error) throw error;
    return updatedBook[0];
  } catch (error) {
    throw error;
  }
};

export const updateUserBook = async (user_book_id, book_updates) => {
  const supabase = useSupabaseClient();
  try {
    const { data: updatedBook, error } = await supabase
      .from("books_user")
      .update(book_updates)
      .match({ id: user_book_id });
    if (error) throw error;
    return updatedBook[0];
  } catch (error) {
    throw error;
  }
};

export const removeBookFromLibrary = async (book_id) => {
  const supabase = useSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("books_user")
      .delete()
      .match({ id: book_id });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchBooks = async (query) => {
  const supabase = useSupabaseClient();
  const params = query.toLowerCase().split(" ");
  let paramString = "";
  params.forEach((term, index) => {
    if (term.length > 0 && index !== 0) paramString += " | ";
    if (term.length > 0) paramString += `'${term.toLowerCase()}'`;
  });
  try {
    const { data, error } = await supabase
      .from("books_edition")
      .select()
      .textSearch("fts", paramString, {
        type: "websearch",
        config: "english",
      });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchGoogleBooks = async (query, quantity) => {
  const searchResults = await $fetch("/api/google-books", {
    method: "post",
    body: { query, quantity },
  });
  return searchResults;
};

export const getBooksUpdatedThisWeek = async () => {
  const supabase = useSupabaseClient();
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  try {
    const { data } = await supabase
      .from("books_user")
      .select()
      .gte("updated_at", lastWeek.toISOString().split("T")[0]);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getBooksUpdatedToday = async () => {
  const supabase = useSupabaseClient();
  console.log(
    "🚀 ~ new Date().toISOString().split(T)[0]",
    new Date().toISOString().split("T")[0]
  );
  try {
    const { data } = await supabase
      .from("books_user")
      .select()
      .gte("updated_at", new Date().toISOString().split("T")[0]);
    return data;
  } catch (error) {
    throw error;
  }
};
