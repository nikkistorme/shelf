import { defineStore } from "pinia";

type ModalState = {
  backdrop: boolean
  modal: boolean
  closeFunctions: { function: () => void }[]
}

export const useModalStore = defineStore("ModalStore", {
  state: (): ModalState => ({
    backdrop: false,
    modal: false,
    closeFunctions: [],
  }),
  actions: {
    openModal() {
      this.backdrop = true;
      this.modal = true;
    },
    closeModal() {
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
