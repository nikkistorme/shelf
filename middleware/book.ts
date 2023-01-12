import { useBookStore } from "~~/store/BookStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const bookStore = useBookStore();
  const { id } = to.params;

  // console.log("🚀 ~ to.path (book)", to.path);
  if (id) {
    try {
      await bookStore.fetchBook(id);
    } catch {
      // console.log('book: Redirecting to /home');
      return navigateTo('/home');
    }
  } else {
    // console.log('book: Redirecting to /home');
    return navigateTo('/home');
  }
})