import { useBookStore } from "~/store/BookStore";
import { useShelfStore } from "~/store/ShelfStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userAuth = useSupabaseUser();
  const shelfStore = useShelfStore();
  const bookStore = useBookStore();
  const loggedIn = !!userAuth?.value?.id;

  if (loggedIn) {
    await shelfStore.fetchShelves();
    await bookStore.fetchInProgressBooks();
  }
})