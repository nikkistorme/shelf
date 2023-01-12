<template>
  <div>
    <IconEditPencil class="cursor-pointer" @click="openUpdateInfoModal" />
    <ModalBookInfo v-if="updatingInfo" :open="updatingInfo" />
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useModalStore } from "~~/store/ModalStore";

export default {
  setup() {
    const updatingInfo = ref(false);
    const modalStore = useModalStore();

    function openUpdateInfoModal() {
      updatingInfo.value = true;
      modalStore.openModal();
    }

    const { modal } = storeToRefs(modalStore);
    watch(modal, (newValue) => {
      if (!newValue) {
        updatingInfo.value = false;
      }
    });

    return {
      updatingInfo,
      openUpdateInfoModal,
    };
  },
};
</script>

<style scoped>
/* .book-page__edit-icon {
  position: absolute;
  top: var(--spacing-size-1);
  right: var(--spacing-size-1);
} */
</style>
