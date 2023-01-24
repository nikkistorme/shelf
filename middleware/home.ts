import { useBookStore } from "~~/store/BookStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userAuth = useSupabaseUser();
  const bookStore = useBookStore();

  if (userAuth?.value?.id) {
    await bookStore.fetchInProgressBooks();
  }
})