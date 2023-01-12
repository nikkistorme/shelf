import { useUserStore } from "~/store/UserStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userAuth = useSupabaseUser();
  const userStore = useUserStore();

  if (userAuth.value && !userStore?.profile?.id) {
    // console.log('Fetching user profile');
    await userStore.fetchProfile();
  }

  // console.log("🚀 ~ to.path (auth)", to.path);
  if (userAuth.value && to.path === "/") {
    // console.log('auth: Redirecting to /home');
    return navigateTo("/home");
  } else if (
    !userAuth.value &&
    to.path !== "/" &&
    !to.path.includes("/books")
  ) {
    // console.log('auth: Redirecting to /');
    return navigateTo("/");
  } else {
    // console.log("auth: No redirect");
  }
});
