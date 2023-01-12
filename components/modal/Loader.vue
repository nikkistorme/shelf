<template>
  <div
    v-show="showLoader"
    class="page-modal__loading d-flex jc-center ai-center"
  >
    <div class="page-modal__loading-backdrop"></div>
    <IconBookLoader class="page-modal__loading-icon" />
  </div>
</template>

<script>
import { useUserStore } from "~~/store/UserStore";
import { useBookStore } from "~~/store/BookStore";
import { useShelfStore } from "~~/store/ShelfStore";

export default {
  setup() {
    const userStore = useUserStore();
    const bookStore = useBookStore();
    const shelfStore = useShelfStore();
    const showLoader = computed(() => {
      return userStore.loading || bookStore.loading || shelfStore.loading;
    });
    return {
      showLoader,
    };
  },
};
</script>

<style>
.page-modal__loading {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: var(--z-index-full-page-loader);
}
.page-modal__loading-backdrop {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.2;
}
.page-modal__loading-icon {
  z-index: var(--z-index-full-page-loader-icon);
}
</style>
