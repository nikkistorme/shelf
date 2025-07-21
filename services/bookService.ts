import { newChange } from "./changeService";
import {
  getAllBooksShelfCount,
  updateAllBooksShelfCount,
} from "./shelfService";

export const bookSchema = (): BookEdition => {
  return {
    id: null,
    inserted_at: null,
    updated_at: null,
    title: null,
    total_pages: null,
    author: null,
    description: null,
    cover: null,
    published: null,
    published_original: null,
    publisher: null,
    isbn: null,
    isbn13: null,
    average_rating: null
  };
};

export const userBookSchema = (): UserBook => {
  return {
    id: null,
    inserted_at: null,
    updated_at: null,
    title: null,
    author: null,
    description: null,
    goal: null,
    cover: null,
    current_page: null,
    total_pages: null,
    user_id: null,
    base: null,
    shelves: null,
    changes: null,
    minutes_per_page: null,
    status: null,
    readthroughs: null,
  };
};

export const addNewBook = async (book: BookEdition): Promise<BookEdition> => {
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

export const addBookToLibrary = async (book: BookEdition): Promise<UserBook> => {
  const supabase = useSupabaseClient();
  const userAuth = useSupabaseUser();
  if (!userAuth.value) throw new Error("User not logged in");
  const change: Change = newChange("addBookToLibrary", book);
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
    const { data: userBook } = await supabase
      .from("books_user")
      .insert([newBook]);

    const allBooksShelfCount = await getAllBooksShelfCount();
    await updateAllBooksShelfCount(allBooksShelfCount);

    if (userBook?.length) return userBook[0];
    else throw new Error("No book returned");
  } catch (error) {
    console.log("🚀 ~ error", error);
    throw error;
  }
};

export const fetchUserBooks = async (): Promise<UserBook[]> => {
  const supabase = useSupabaseClient();
  try {
    const { data: books, error } = await supabase.from("books_user").select();
    if (error) throw error;
    return books;
  } catch (error) {
    throw error;
  }
};

export const fetchInProgressBooks = async (): Promise<UserBook[]> => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("books_user")
      .select()
      .eq("status", "in_progress");
    if (data?.length) return data;
    return [];
  } catch (error) {
    throw error;
  }
};

export const fetchBook = async (book_id: BookEdition["id"]): Promise<{book: BookEdition, userBook: UserBook}> => {
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

export const startReadingBook = async (user_book: UserBook) => {
  const supabase = useSupabaseClient();
  const change: Change = newChange("startReadingBook", user_book);
  if (!user_book.changes) user_book.changes = [];
  const bookUpdates = {
    current_page: 0,
    changes: [...user_book.changes, change],
    status: "in_progress",
  } as Partial<UserBook>;
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
