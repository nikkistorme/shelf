export const sortShelves = (shelves) => {
  if (!shelves?.length) return [];
  const sortedShelves = [];
  const unlockedShelves = shelves.filter((s) => !s.locked_type);
  unlockedShelves.sort((a, b) => (a.name > b.name ? 1 : -1));

  const allBooksShelf = shelves.find((s) => s.locked_type === "all_books");
  const finishedShelf = shelves.find((s) => s.locked_type === "finished");
  const inProgressShelf = shelves.find((s) => s.locked_type === "in_progress");
  const unreadShelf = shelves.find((s) => s.locked_type === "unread");

  if (allBooksShelf) sortedShelves.push(allBooksShelf);
  if (finishedShelf) sortedShelves.push(finishedShelf);
  if (inProgressShelf) sortedShelves.push(inProgressShelf);
  if (unreadShelf) sortedShelves.push(unreadShelf);
  sortedShelves.push(...unlockedShelves);
  return sortedShelves;
};

export const createNecessaryShelves = async (shelfTypes) => {
  const supabase = useSupabaseClient();
  const userAuth = useSupabaseUser();
  try {
    const shelves = await Promise.all(
      shelfTypes.map(async (type) => {
        let book_count;
        switch (type) {
          case "all_books":
            book_count = await getAllBooksShelfCount();
            return {
              locked_type: "all_books",
              user_id: userAuth.value.id,
              name: "All Books",
              book_count: book_count || 0,
            };
          case "in_progress":
            book_count = await getInProgressShelfCount();
            return {
              locked_type: "in_progress",
              user_id: userAuth.value.id,
              name: "In Progress",
              book_count: book_count || 0,
            };
          case "finished":
            book_count = await getFinishedShelfCount();
            return {
              locked_type: "finished",
              user_id: userAuth.value.id,
              name: "Finished",
              book_count: book_count || 0,
            };
          case "unread":
            book_count = await getUnreadShelfCount();
            return {
              locked_type: "unread",
              user_id: userAuth.value.id,
              name: "Unread",
              book_count: book_count || 0,
            };
        }
      })
    );
    const { data } = await supabase.from("shelves").insert(shelves);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createNewShelf = async (name) => {
  const supabase = useSupabaseClient();
  const userAuth = useSupabaseUser();
  try {
    const { data } = await supabase
      .from("shelves")
      .insert([{ name, user_id: userAuth.value.id }]);
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const fetchShelves = async () => {
  const supabase = useSupabaseClient();
  try {
    const { data: shelves } = await supabase.from("shelves").select();
    return shelves;
  } catch (error) {
    throw error;
  }
};

export const fetchShelf = async (shelf_id) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase.from("shelves").select().eq("id", shelf_id);
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const fetchBooksForShelf = async (shelf) => {
  const supabase = useSupabaseClient();
  let books;
  try {
    switch (shelf?.locked_type) {
      case "all_books":
        const { data: allBooks } = await supabase.from("books_user").select();
        books = allBooks;
        break;
      case "in_progress":
        const { data: inProgressBooks } = await supabase
          .from("books_user")
          .select()
          .eq("status", "in_progress");
        books = inProgressBooks;
        break;
      case "unread":
        const { data: unreadBooks } = await supabase
          .from("books_user")
          .select()
          .eq("status", "unread");
        books = unreadBooks;
        break;
      case "finished":
        const { data: finishedBooks } = await supabase
          .from("books_user")
          .select()
          .eq("status", "finished");
        books = finishedBooks;
        break;
      default:
        const { data: booksForShelf } = await supabase
          .from("books_user")
          .select()
          .contains("shelves", [shelf.id]);
        books = booksForShelf;
        break;
    }
  } catch (error) {
    throw error;
  }
  return books;
};

export const updateShelfSort = async (shelf) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .update({ sort: shelf.sort })
      .match({ id: shelf.id });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const getAllBooksShelfCount = async () => {
  const supabase = useSupabaseClient();
  try {
    const { error, count } = await supabase
      .from("books_user")
      .select("*", { count: "exact" })
      .range(0, 1);
    return count;
  } catch (error) {
    throw error;
  }
};

export const updateAllBooksShelfCount = async (count) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .update({ book_count: count })
      .match({ locked_type: "all_books" });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const getInProgressShelfCount = async () => {
  const supabase = useSupabaseClient();
  try {
    const { count } = await supabase
      .from("books_user")
      .select("*", { count: "exact" })
      .eq("status", "in_progress")
      .range(0, 1);
    return count;
  } catch (error) {
    throw error;
  }
};

export const getFinishedShelfCount = async () => {
  const supabase = useSupabaseClient();
  try {
    const { count } = await supabase
      .from("books_user")
      .select("*", { count: "exact" })
      .eq("status", "finished")
      .range(0, 1);
    return count;
  } catch (error) {
    throw error;
  }
};

export const getUnreadShelfCount = async () => {
  const supabase = useSupabaseClient();
  try {
    const { count } = await supabase
      .from("books_user")
      .select("*", { count: "exact" })
      .not("status", "in", '("finished", "in_progress")')
      .range(0, 1);
    return count;
  } catch (error) {
    throw error;
  }
};

export const updateInProgressShelfCount = async (count) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .update({ book_count: count })
      .match({ locked_type: "in_progress" });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const updateShelfName = async (shelf_id, newName) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .update({ name: newName })
      .match({ id: shelf_id });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const deleteShelf = async (shelf_id) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .delete()
      .match({ id: shelf_id });
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const setShelfProperties = async (shelf_id, properties) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase
      .from("shelves")
      .update(properties)
      .match({ id: shelf_id });
    return data[0];
  } catch (error) {
    throw error;
  }
};
