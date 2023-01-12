export const sortShelves = (shelves) => {
  const sorted = [...shelves];
  const allBooksShelf = shelves.find((s) => s.all_books_shelf);
  const finishedShelf = shelves.find((s) => s.finished_shelf);
  const inProgressShelf = shelves.find((s) => s.in_progress_shelf);
  const unreadShelf = shelves.find((s) => s.unread_shelf);
  shelves.forEach((s) => {
    if (
      s.all_books_shelf ||
      s.finished_shelf ||
      s.in_progress_shelf ||
      s.unread_shelf
    ) {
      const index = sorted.indexOf(s);
      sorted.splice(index, 1);
    }
  });
  sorted.sort((a, b) => (a.name > b.name ? 1 : -1));
  if (unreadShelf) sorted.unshift(unreadShelf);
  if (inProgressShelf) sorted.unshift(inProgressShelf);
  if (finishedShelf) sorted.unshift(finishedShelf);
  if (allBooksShelf) sorted.unshift(allBooksShelf);
  return sorted;
};

export const createNecessaryShelves = async (shelfTypes) => {
  const supabase = useSupabaseClient();
  const userAuth = useSupabaseUser();
  const shelves = await Promise.all(
    shelfTypes.map(async (type) => {
      let book_count;
      switch (type) {
        case "all_books_shelf":
          book_count = await getAllBooksShelfCount();
          return {
            all_books_shelf: true,
            user_id: userAuth.value.id,
            name: "All Books",
            book_count: book_count || 0,
          };
        case "in_progress_shelf":
          book_count = await getInProgressShelfCount();
          return {
            in_progress_shelf: true,
            user_id: userAuth.value.id,
            name: "In Progress",
            book_count: book_count || 0,
          };
        case "finished_shelf":
          book_count = await getFinishedShelfCount();
          return {
            finished_shelf: true,
            user_id: userAuth.value.id,
            name: "Finished",
            book_count: book_count || 0,
          };
        case "unread_shelf":
          book_count = await getUnreadShelfCount();
          return {
            unread_shelf: true,
            user_id: userAuth.value.id,
            name: "Unread",
            book_count: book_count || 0,
          };
      }
    })
  );
  console.log("🚀 ~ shelves", shelves);
  try {
    const { data } = await supabase.from("shelves").insert(shelves);
    return;
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
    const { data: shelves } = await supabase
      .from("shelves")
      .select(
        "inserted_at, name, id, in_progress_shelf, all_books_shelf, finished_shelf, unread_shelf, sort, book_count"
      );
    return shelves;
  } catch (error) {
    throw error;
  }
};

export const fetchShelf = async (shelf_id) => {
  const supabase = useSupabaseClient();
  try {
    const { data } = await supabase.from("shelves").select().eq("id", shelf_id);
    console.log("🚀 ~ data", data);
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const fetchBooksForShelf = async (shelf) => {
  const supabase = useSupabaseClient();
  let books;
  try {
    if (shelf?.all_books_shelf) {
      const { data } = await supabase.from("books_user").select();
      books = data;
    } else if (shelf?.in_progress_shelf) {
      const { data } = await supabase
        .from("books_user")
        .select()
        .eq("status", "in_progress");
      books = data;
    } else if (shelf?.unread_shelf) {
      const { data } = await supabase
        .from("books_user")
        .select()
        .eq("status", "unread");
      books = data;
    } else if (shelf?.finished_shelf) {
      const { data } = await supabase
        .from("books_user")
        .select()
        .eq("status", "finished");
      books = data;
    } else {
      const { data } = await supabase
        .from("books_user")
        .select()
        .contains("shelves", [shelf.id]);
      books = data;
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
      .match({ all_books_shelf: true });
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
      .not("readthroughs", "is", null)
      .not("readthroughs", "is", "[]")
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
      .match({ in_progress_shelf: true });
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
