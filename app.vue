<template>
  <div class="app-container d-flex flex-column">
    <ModalWrapper />
    <HeaderBar />
    <main class="app-content">
      <NuxtPage />
    </main>
    <AddBookButton v-if="userAuth" />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useShelfStore } from "~/store/ShelfStore";
import { useUserStore } from "~/store/UserStore";

export default {
  setup() {
    const router = useRouter();
    useHead({
      link: [
        {
          rel: "canonical",
          href: `https://shelf.is${router.currentRoute.value.path}`,
        },
      ],
    });
    const userStore = useUserStore();
    const userAuth = useSupabaseUser();

    const { profile } = storeToRefs(userStore);
    watch(userAuth, async () => {
      if (userAuth?.value?.id && !profile.value) {
        console.log("Fetching profile");
        try {
          await userStore.fetchProfile();
        } catch (error) {
          console.error(error);
          await userStore.addUserProfile();
          router.push("/home");
        }
      }
    });

    return {
      userAuth,
    };
  },
};
</script>

<style>
.app-content {
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  max-width: var(--content-max-width);
  padding: var(--spacing-size-1);
  /* overflow: hidden; */
}
@media (min-width: 768px) {
  .app-content {
    margin: var(--spacing-size-4) auto;
    padding: 0 var(--spacing-size-4);
  }
}
</style>
