import { useShelfStore } from "~/store/ShelfStore"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { id } = to.params;

  const shelfStore = useShelfStore();
  
  await shelfStore.fetchShelves();
  let shelf;
  let redirectURL;

  if (id) shelf = shelfStore.getShelfById(id);

  if (to.name === "shelves" || !shelf) {
    await shelfStore.setActiveShelf(shelfStore.allBooksShelf);
    redirectURL = `/shelves/${shelfStore.activeShelf.id}`;
    console.log("shelves: Redirecting to", redirectURL);
    return navigateTo(redirectURL);
  } else if (shelf) {
    await shelfStore.setActiveShelf(shelf);
  }
})
