import { useBookStore } from "~/store/BookStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const bookStore = useBookStore();
  const { id } = to.params;

  if (id) {
    try {
      await bookStore.fetchBook(id);
    } catch {
      return navigateTo('/home');
    }
  } else {
    return navigateTo('/home');
  }
})