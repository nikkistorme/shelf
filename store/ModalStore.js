import { defineStore } from "pinia";

export const useModalStore = defineStore({
  id: "ModalStore",
  state: () => ({
    backdrop: false,
    modal: false,
    closeFunctions: [],
  }),
  actions: {
    openModal() {
      this.backdrop = true;
      this.modal = true;
    },
    closeModal(type = null) {
      this.modal = false;
      this.backdrop = false;
      this.closeFunctions.forEach((fn) => {
        fn.function();
      });
    },
    closeAllModals() {
      this.modal = false;
      this.backdrop = false;
    },
  },
});
