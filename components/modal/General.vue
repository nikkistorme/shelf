<template>
  <div :class="`generic-modal ${show && isMounted ? 'show' : ''}`">
    <button
      @click="closeModal()"
      type="button"
      class="modal-close button-style-reset cursor-pointer"
    >
      <IconClose />
    </button>
    <div v-if="slots.content" class="content">
      <slot name="content" />
    </div>
    <div v-if="slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import { useModalStore } from "~/store/ModalStore";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const slots = useSlots();
    const modalStore = useModalStore();
    const { openModal, closeModal } = modalStore;
    const isMounted = ref(false);
    onMounted(() => {
      modalStore.closeFunctions.push({
        type: "readthroughs",
        function: props.close,
      });
      setTimeout(() => {
        isMounted.value = true;
      }, 300);
    });
    watch(
      () => props.show,
      (val) => {
        if (val && isMounted) openModal();
      }
    );
    return { isMounted, slots, closeModal };
  },
};
</script>

<style scoped>
.generic-modal {
  position: fixed;
  top: 125vh;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-rows: calc(36px + var(--spacing-size-half));
  gap: var(--spacing-size-half);
  width: max-content;
  min-width: 250px;
  max-width: calc(100vw - var(--spacing-size-1) - var(--spacing-size-1));
  max-height: 350px;
  padding: var(--spacing-size-1);
  border-radius: var(--border-radius-2);
  background-color: white;
  box-shadow: var(--box-shadow-1);
  z-index: var(--z-index-modal);
  opacity: 0;
  scroll-behavior: smooth;
  transition: top 0.3s ease-in-out, opacity 0s 0.3s;
}
.generic-modal.show {
  top: 50%;
  opacity: 1;
  transition: top 0.3s ease-in-out, opacity 0s 0s;
}
.generic-modal .content {
  overflow: hidden auto;
}
.generic-modal .actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: var(--spacing-size-1);
  width: 100%;
  padding-top: var(--spacing-size-half);
  border-top: 2px solid var(--color-gray);
}
.modal-close {
  position: absolute;
  top: var(--spacing-size-1);
  right: var(--spacing-size-1);
}
</style>
