import { useBookStore } from "~~/store/BookStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userAuth = useSupabaseUser();
  const bookStore = useBookStore();

  console.log("userAuth", 'line 7');
  if (userAuth?.value?.id) {
    console.log("userAuth", 'line 9');
    await bookStore.fetchInProgressBooks();
  }
})