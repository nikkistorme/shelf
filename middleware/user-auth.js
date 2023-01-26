import { useUserStore } from "~/store/UserStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userAuth = useSupabaseUser();
  const userStore = useUserStore();
  const loggedIn = !!userAuth?.value?.id;
  const profileLoaded = !!userStore?.profile?.id;

  if (loggedIn && !profileLoaded) {
    try {
      await userStore.fetchProfile();
    } catch (error) {
      console.log("🚫 ~ User Auth Error", error);
      await userStore.addUserProfile();
    }
  }

  if (loggedIn && to.path === "/") {
    return navigateTo("/home");
  } else if (!loggedIn && to.path !== "/" && !to.path.includes("/books")) {
    return navigateTo("/");
  }
});
