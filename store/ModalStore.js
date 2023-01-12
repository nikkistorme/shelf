import { defineStore } from "pinia";

export const useModalStore = defineStore({
  id: "ModalStore",
  state: () => ({
    backdrop: false,
    modal: false,
  }),
  actions: {
    openModal() {
      this.backdrop = true;
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
      this.backdrop = false;
    },
    closeAllModals() {
      this.modal = false;
      this.backdrop = false;
    },
  },
});
