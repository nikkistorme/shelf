<template>
  <div
    class="page-modal__overlay"
    :class="{ open: modalStore.backdrop }"
    @click="closeAllModals"
  ></div>
</template>

<script>
import { useModalStore } from "~/store/ModalStore";

export default {
  setup() {
    const modalStore = useModalStore();
    const closeAllModals = modalStore.closeAllModals;

    return {
      modalStore,
      closeAllModals,
    };
  },
};
</script>

<style>
.page-modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: var(--z-index-modal-backdrop);
}
.page-modal__overlay.open {
  visibility: visible;
  opacity: 0.2;
}
</style>
