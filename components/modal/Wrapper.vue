<template>
  <div class="page-modal">
    <ModalBackdrop />
    <!-- <ConfirmModal v-if="confirmAction.message" /> -->
    <ModalLoader />
  </div>
</template>

<script>
import { useModalStore } from "~/store/ModalStore";

export default {
  setup() {
    const modalStore = useModalStore();

    onMounted(() => {
      window.addEventListener("keyup", (e) => {
        if (e.key && e.key === "Escape") modalStore.closeModal();
      });
    });
  },
};
</script>

<style>
.page-modal__modal {
  width: 100%;
  height: 100%;
}
</style>
